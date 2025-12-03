import { supabase } from "@/utils/supabase/supabaseClient";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import { User } from "../../models/user_model";

export async function listUsersDB(
  enterprise_id: number,
  filters?: {
    safe_delete?: boolean;
  }
): Promise<User[]> {
  let query = supabase
    .from("users")
    .select("*")
    .eq("enterprise_id", enterprise_id);

  // Apply filters at DB level
  if (filters && typeof filters.safe_delete === "boolean") {
    query = query.eq("safe_delete", filters.safe_delete);
  }

  const { data: usersData, error: usersError } = await query;

  if (usersError) {
    throw new Error(`Erro ao buscar usuários: ${usersError.message}`);
  }

  if (!usersData || usersData.length === 0) {
    return [];
  }

  const usersWithAuth = await Promise.all(
    usersData.map(async (userData) => {
      try {
        const { data: authData } = await supabaseAdmin.auth.admin.getUserById(
          userData.id
        );
        const name =
          authData.user?.user_metadata?.name ||
          authData.user?.user_metadata?.full_name ||
          "";
        const email = authData.user?.email;
        return new User(
          userData.id,
          userData.enterprise_id,
          userData.is_admin,
          userData.safe_delete,
          userData.is_owner,
          name,
          email
        );
      } catch {
        return userData as User;
      }
    })
  );

  return usersWithAuth;
}
