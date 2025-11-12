import { supabase } from "@/utils/supabase/supabaseClient";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import { User } from "@/lib/models/user_model";
import { insertUser } from "@/lib/data-base/user/insert-user";
import { insertEnterpriseDB } from "@/lib/data-base/enterprise/insert-enterprise";
import { insertUnitsDB } from "@/lib/data-base/unit/insert-units";
import { insertGroupsDB } from "@/lib/data-base/group/insert-groups";
import { insertSegmentsDB } from "@/lib/data-base/segment/insert-segments";
import { selectUserByIdDB } from "@/lib/data-base/user/select-user-by-id";
import unitsData from "@/utils/data/unit.json";
import groupsData from "@/utils/data/group.json";
import segmentsData from "@/utils/data/segment.json";

export interface CreateUserWithGoogleParams {
    is_admin: boolean;
    is_owner: boolean;
    redirectTo?: string;
}

/**
 * Inicia o fluxo OAuth com Google para criar um usuário.
 * - O usuário será redirecionado para o Google para consentimento.
 * - Após callback, use `finalizeUserAfterGoogleOAuth` para completar a criação na tabela users.
 * - Se `is_owner` === true: ao finalizar, cria enterprise e popula dados base.
 * - Caso contrário: associa à enterprise do usuário logado que iniciou o fluxo.
 * 
 * Retorna `data` do OAuth (pode conter `url` para redirect).
 */
export async function createUserWithGoogle({
    is_admin,
    is_owner,
    redirectTo,
}: CreateUserWithGoogleParams) {
    // Salvar preferências no localStorage para recuperar após callback
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('pending_user_creation', JSON.stringify({ is_admin, is_owner }));
    }

    const options = redirectTo ? { redirectTo } : undefined;
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options,
    });

    if (error) {
        throw new Error(`Erro ao iniciar OAuth com Google: ${error.message}`);
    }

    return data;
}

/**
 * Finaliza a criação do usuário após o OAuth callback do Google.
 * - Verifica se o usuário já existe na tabela `users`.
 * - Se `is_owner`: cria enterprise e popula dados base.
 * - Caso contrário: usa enterprise_id fornecido (do contexto do usuário logado).
 */
export async function finalizeUserAfterGoogleOAuth({
    is_admin,
    is_owner,
    myUserEnterpriseId,
}: { is_admin: boolean; is_owner: boolean; myUserEnterpriseId?: string | null }): Promise<User> {
    // 1) Obter usuário autenticado pelo Google OAuth
    const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
    
    if (sessionError || !sessionData?.user) {
        throw new Error("Nenhuma sessão ativa após OAuth. Faça login novamente.");
    }

    const authUser = sessionData.user;
    const authUserId = authUser.id;
    const email = authUser.email!;
    const name = authUser.user_metadata?.name || authUser.user_metadata?.full_name;

    // 2) Verificar se usuário já existe na tabela users
    const existingUser = await selectUserByIdDB(authUserId);
    if (existingUser) {
        console.log(`Usuário ${authUserId} já existe na tabela users.`);
        return existingUser;
    }

    // 3) Determinar enterprise_id
    let enterpriseId: number;
    let createdEnterpriseIdForOwner: number | undefined;

    if (is_owner) {
        // Owner: cria nova enterprise
        try {
            const ent = await insertEnterpriseDB();
            enterpriseId = ent.id;
            createdEnterpriseIdForOwner = ent.id;
        } catch (err: any) {
            throw new Error(`Falha ao criar enterprise: ${err?.message || String(err)}`);
        }
    } else {
        // Não-owner: usa enterprise_id do contexto (usuário que iniciou o fluxo)
        if (!myUserEnterpriseId) {
            throw new Error("enterprise_id não fornecido. É necessário estar logado para criar usuário não-owner.");
        }
        enterpriseId = Number(myUserEnterpriseId);
    }

    // 4) Criar usuário na tabela users
    const newUser = new User(
        authUserId,
        enterpriseId,
        is_admin,
        false,
        is_owner,
        name,
        email
    );

    try {
        await insertUser(newUser);
    } catch (err) {
        // Rollback: remover enterprise se owner
        if (is_owner && createdEnterpriseIdForOwner) {
            try {
                await supabaseAdmin.from("enterprise").delete().eq("id", createdEnterpriseIdForOwner);
            } catch (rbErr) {
                console.error("Falha ao remover enterprise após erro em insertUser:", rbErr);
            }
        }
        throw err;
    }

    // 5) Se owner, popular dados base
    if (is_owner) {
        let insertedUnits: any[] | undefined;
        let insertedGroups: any[] | undefined;
        let insertedSegments: any[] | undefined;

        try {
            insertedUnits = await insertUnitsDB(unitsData as any, enterpriseId);
            insertedGroups = await insertGroupsDB(groupsData as any, enterpriseId);
            insertedSegments = await insertSegmentsDB(segmentsData as any, enterpriseId);
        } catch (seedErr: any) {
            // Rollback completo
            try {
                if (insertedUnits?.length) {
                    const ids = insertedUnits.map((u) => u.id).filter(Boolean);
                    if (ids.length) await supabaseAdmin.from("unit").delete().in("id", ids);
                }
                if (insertedGroups?.length) {
                    const ids = insertedGroups.map((g) => g.id).filter(Boolean);
                    if (ids.length) await supabaseAdmin.from("group_table").delete().in("id", ids);
                }
                if (insertedSegments?.length) {
                    const ids = insertedSegments.map((s) => s.id).filter(Boolean);
                    if (ids.length) await supabaseAdmin.from("segment").delete().in("id", ids);
                }
                await supabaseAdmin.from("users").delete().eq("id", authUserId);
                await supabaseAdmin.auth.admin.deleteUser(authUserId);
                if (createdEnterpriseIdForOwner) {
                    await supabaseAdmin.from("enterprise").delete().eq("id", createdEnterpriseIdForOwner);
                }
            } catch (rbErr) {
                throw new Error(
                    `Falha ao inserir dados base: ${seedErr.message}. Erro no rollback: ${(rbErr as any)?.message || String(rbErr)}`
                );
            }
            throw new Error(`Falha ao popular dados base: ${seedErr.message}`);
        }
    }

    console.log(`Usuário ${authUserId} criado via Google OAuth (owner=${is_owner}).`);
    return newUser;
}