import { supabase } from "@/utils/supabase/supabaseClient";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import { User } from "@/lib/models/user_model";
import { insertUser } from "@/lib/data-base/user/insert-user";
import { insertUnitsDB } from "@/lib/data-base/unit/insert-units";
import { insertGroupsDB } from "@/lib/data-base/group/insert-groups";
import { insertSegmentsDB } from "@/lib/data-base/segment/insert-segments";

import unitsData from "@/utils/data/unit.json";
import groupsData from "@/utils/data/group.json";
import segmentsData from "@/utils/data/segment.json";

export interface CreateUserParams {
    email: string;
    password: string;
    enterprise_id: number;
    name?: string;
}

/**
 * Cria um usuário owner (is_admin=true, is_owner=true) e popula
 * unidades, grupos e segmentos a partir dos JSONs em utils/data.
 * Em caso de falha nas inserções após a criação do usuário, tenta rollback.
 */
export async function createUserOwner({
    email,
    password,
    enterprise_id,
    name,
}: CreateUserParams): Promise<User> {
    // 1) Cria no Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: name ? { data: { name } } : undefined,
    });

    if (signUpError || !signUpData?.user) {
        throw new Error(`Erro ao criar usuário no Auth: ${signUpError?.message || "Desconhecido"}`);
    }

    const authUserId = signUpData.user.id;

    // 2) Insere o usuário na tabela users como admin/owner
    const newUser = new User(authUserId, enterprise_id, true, false, true, name, email);

    try {
        await insertUser(newUser);
    } catch (err) {
        // insertUser já tenta rollback no Auth quando falha ao inserir na tabela users.
        throw err;
    }

    // 3) Popular tabelas base (units, groups, segments)
    // Guardamos referências dos registros inseridos para possível rollback.
    let insertedUnits: any[] | undefined;
    let insertedGroups: any[] | undefined;
    let insertedSegments: any[] | undefined;

    try {
        insertedUnits = await insertUnitsDB(unitsData as any, enterprise_id);
        insertedGroups = await insertGroupsDB(groupsData as any, enterprise_id);
        insertedSegments = await insertSegmentsDB(segmentsData as any, enterprise_id);
    } catch (insertErr: any) {
        // Tentativa de rollback: deletar registros inseridos e o usuário criado
        try {
            if (insertedUnits && insertedUnits.length) {
                const ids = insertedUnits.map((r) => r.id).filter(Boolean);
                if (ids.length) await supabaseAdmin.from("unit").delete().in("id", ids);
            }
            if (insertedGroups && insertedGroups.length) {
                const ids = insertedGroups.map((r) => r.id).filter(Boolean);
                if (ids.length) await supabaseAdmin.from("group_table").delete().in("id", ids);
            }
            if (insertedSegments && insertedSegments.length) {
                const ids = insertedSegments.map((r) => r.id).filter(Boolean);
                if (ids.length) await supabaseAdmin.from("segment").delete().in("id", ids);
            }

            // Deletar usuário da tabela users (se inserido) e do Auth
            await supabaseAdmin.from("users").delete().eq("id", newUser.id);
            await supabaseAdmin.auth.admin.deleteUser(newUser.id);
        } catch (rbErr) {
                    throw new Error(
                        `Falha ao inserir dados base: ${insertErr.message}. E falha no rollback: ${(rbErr as any)?.message || String(rbErr)}`
                    );
        }

        // Re-throw original insert error
        throw new Error(`Falha ao popular dados iniciais: ${insertErr.message}`);
    }

    console.log(`Usuário owner ${newUser.id} criado e dados base inseridos.`);

    return newUser;
}