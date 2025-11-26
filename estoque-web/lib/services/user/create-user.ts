import { supabase } from "@/utils/supabase/supabaseClient";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import { User } from "@/lib/models/user_model";
import { insertUser } from "@/lib/data-base/user/insert-user";
import { insertEnterpriseDB } from "@/lib/data-base/enterprise/insert-enterprise";
import { insertUnitsDB } from "@/lib/data-base/unit/insert-units";
import { insertGroupsDB } from "@/lib/data-base/group/insert-groups";
import { insertSegmentsDB } from "@/lib/data-base/segment/insert-segments";
import unitsData from "@/utils/data/unit.json";
import groupsData from "@/utils/data/group.json";
import segmentsData from "@/utils/data/segment.json";

export interface CreateUserParams {
  email: string;
  password: string;
  is_admin: boolean;
  is_owner: boolean;
  name?: string;
  myUserEnterpriseId?: string | null;
}

/**
 * Cria um usuário.
 * - Se `is_owner` === true: cria uma nova enterprise, insere o usuário como admin/owner e popula unidades/grupos/segmentos.
 * - Caso contrário: associa o novo usuário à enterprise do usuário atualmente logado.
 * Rollbacks:
 *   - Falha no signUp (owner): remove enterprise criada.
 *   - Falha ao inserir usuário (owner): remove enterprise e usuário do Auth (handled parcialmente em insertUser) + enterprise.
 *   - Falha ao popular dados base (owner): remove unidades/grupos/segmentos inseridos, o usuário (users + Auth) e a enterprise.
 */
export async function createUser({
  email,
  password,
  is_admin,
  is_owner,
  name,
  myUserEnterpriseId,
}: CreateUserParams): Promise<User> {
  let enterpriseId: number | undefined;
  let createdEnterpriseIdForOwner: number | undefined;

  if (is_owner) {
    // Owner: cria enterprise antes para permitir rollback em caso de falha posterior.
    try {
      const ent = await insertEnterpriseDB();
      enterpriseId = ent.id;
      createdEnterpriseIdForOwner = ent.id;
    } catch (err: any) {
      throw new Error(
        `Falha ao criar enterprise: ${err?.message || String(err)}`
      );
    }
  } else {
    // Não-owner: usa enterprise_id do usuário logado (já disponível no contexto)
    if (!myUserEnterpriseId) {
      throw new Error(
        "É necessário estar logado para criar um usuário não-owner."
      );
    }
    enterpriseId = Number(myUserEnterpriseId);
  }

  // 1) Cria usuário no Auth (isso muda a sessão local para o novo usuário)
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: name ? { data: { name } } : undefined,
  });

  if (signUpError || !signUpData?.user) {
    // Rollback enterprise criada (apenas owner)
    if (is_owner && createdEnterpriseIdForOwner) {
      try {
        await supabaseAdmin
          .from("enterprise")
          .delete()
          .eq("id", createdEnterpriseIdForOwner);
      } catch (rbErr) {
        throw new Error(
          `Erro ao criar usuário no Auth: ${signUpError?.message || "Desconhecido"}. Falha no rollback da enterprise: ${(rbErr as any)?.message || String(rbErr)}`
        );
      }
    }
    throw new Error(
      `Erro ao criar usuário no Auth: ${signUpError?.message || "Desconhecido"}`
    );
  }

  const authUserId = signUpData.user.id;
  const newUser = new User(
    authUserId,
    enterpriseId!,
    is_admin,
    false,
    is_owner,
    name,
    email
  );

  // 2) Inserir na tabela users
  try {
    await insertUser(newUser);
  } catch (err) {
    // Se owner, tentar remover enterprise criada
    if (is_owner && createdEnterpriseIdForOwner) {
      try {
        await supabaseAdmin
          .from("enterprise")
          .delete()
          .eq("id", createdEnterpriseIdForOwner);
      } catch (rbErr) {
        console.error(
          "Falha ao remover enterprise após erro em insertUser:",
          rbErr
        );
      }
    }
    throw err;
  }

  // 3) Se owner, popular dados base (units, groups, segments)
  if (is_owner) {
    let insertedUnits: any[] | undefined;
    let insertedGroups: any[] | undefined;
    let insertedSegments: any[] | undefined;
    try {
      insertedUnits = await insertUnitsDB(
        unitsData as any,
        newUser.enterprise_id
      );
      insertedGroups = await insertGroupsDB(
        groupsData as any,
        newUser.enterprise_id
      );
      insertedSegments = await insertSegmentsDB(
        segmentsData as any,
        newUser.enterprise_id
      );
    } catch (seedErr: any) {
      // Rollback completo: remover inserções, usuário e enterprise
      try {
        if (insertedUnits?.length) {
          const ids = insertedUnits.map((u) => u.id).filter(Boolean);
          if (ids.length)
            await supabaseAdmin.from("unit").delete().in("id", ids);
        }
        if (insertedGroups?.length) {
          const ids = insertedGroups.map((g) => g.id).filter(Boolean);
          if (ids.length)
            await supabaseAdmin.from("group_table").delete().in("id", ids);
        }
        if (insertedSegments?.length) {
          const ids = insertedSegments.map((s) => s.id).filter(Boolean);
          if (ids.length)
            await supabaseAdmin.from("segment").delete().in("id", ids);
        }
        await supabaseAdmin.from("users").delete().eq("id", newUser.id);
        await supabaseAdmin.auth.admin.deleteUser(newUser.id);
        if (createdEnterpriseIdForOwner) {
          await supabaseAdmin
            .from("enterprise")
            .delete()
            .eq("id", createdEnterpriseIdForOwner);
        }
      } catch (rbErr) {
        throw new Error(
          `Falha ao inserir dados base: ${seedErr.message}. Erro no rollback: ${(rbErr as any)?.message || String(rbErr)}`
        );
      }
      throw new Error(`Falha ao popular dados base: ${seedErr.message}`);
    }
  }

  console.log(`Usuário ${newUser.id} criado (owner=${is_owner}).`);
  return newUser;
}