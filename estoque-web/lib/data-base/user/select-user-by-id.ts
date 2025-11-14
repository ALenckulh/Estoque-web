import { supabase } from "@/utils/supabase/supabaseClient";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import { User } from "../../models/user_model";

// Buscar usuário por ID (UUID) com dados do Auth (nome e email)
export async function selectUserByIdDB(id: string): Promise<User | null> {
  // 1. Busca os dados da tabela public.users
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (userError) {
    // PGRST116 = nenhuma linha encontrada
    if (userError.code === "PGRST116") {
      return null;
    }
    throw new Error(`Erro ao buscar usuário: ${userError.message}`);
  }

  // 2. Busca os dados do Auth (email e metadados do usuário)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.getUserById(id);
  
  if (authError) {
    // Se não conseguir buscar do Auth, retorna apenas os dados da tabela
    console.warn(`Não foi possível buscar dados do Auth para usuário ${id}: ${authError.message}`);
    return userData as User;
  }

  // 3. Combina os dados (user_metadata pode conter 'name' ou 'full_name')
  const name = authData.user?.user_metadata?.name || authData.user?.user_metadata?.full_name;
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
}