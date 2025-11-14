import { supabase } from "@/utils/supabase/supabaseClient";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import { User } from "@/lib/models/user_model";

interface UpdateParameters {
  name?: string;
  is_admin?: boolean;
  password?: string;
}

export async function updateUserDB(
  id: string,
  updates: UpdateParameters
): Promise<User> {
  const { name, is_admin, password } = updates;

  // 1. Atualiza is_admin na tabela public.users (se fornecido)
  if (is_admin !== undefined) {
    const { error: dbError } = await supabase
      .from("users")
      .update({ is_admin })
      .eq("id", id);

    if (dbError) {
      throw new Error(`Erro ao atualizar is_admin: ${dbError.message}`);
    }
  }

  // 2. Atualiza name e/ou password no Auth (se fornecidos)
  if (name !== undefined || password !== undefined) {
    const authUpdates: { user_metadata?: { name: string }; password?: string } = {};
    
    if (name !== undefined) {
      authUpdates.user_metadata = { name };
    }
    if (password !== undefined) {
      authUpdates.password = password;
    }

    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      id,
      authUpdates
    );

    if (authError) {
      throw new Error(`Erro ao atualizar dados do Auth: ${authError.message}`);
    }
  }

  // 3. Busca e retorna o usuário atualizado
  const { data: userData, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !userData) {
    throw new Error(`Erro ao buscar usuário atualizado: ${fetchError?.message}`);
  }

  // 4. Busca dados do Auth para preencher name/email
  const { data: authData } = await supabaseAdmin.auth.admin.getUserById(id);
  const userName = authData.user?.user_metadata?.name || authData.user?.user_metadata?.full_name;
  const userEmail = authData.user?.email;

  return new User(
    userData.id,
    userData.enterprise_id,
    userData.is_admin,
    userData.safe_delete,
    userData.is_owner,
    userName,
    userEmail
  );
}