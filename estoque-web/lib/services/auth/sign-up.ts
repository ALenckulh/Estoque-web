import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import type { User as SupabaseAuthUser } from "@supabase/supabase-js";

export interface signUpParams {
  email: string;
  password: string;
  email_confirm?: boolean;
  user_metadata?: Record<string, any>;
}

/**
 * Cria um usuário no Supabase Auth usando a Admin API (service role).
 * Retorna o objeto de usuário do Supabase Auth.
 */

export async function signUp(
  params: signUpParams
): Promise<{ user: SupabaseAuthUser | null; alreadyExists: boolean; emailConfirmed: boolean }> {
  const { email, password, email_confirm = false, user_metadata } = params;

  if (!email || !password) {
    throw new Error("Email e senha são obrigatórios");
  }

  // 1. Verifica se o usuário já existe
  // listUsers não aceita filtro por email diretamente, então filtramos manualmente
  const existing = await supabaseAdmin.auth.admin.listUsers();
  const user = existing.data?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (user) {
    // Usuário já existe
    const emailConfirmed = !!user.email_confirmed_at;
    return { user, alreadyExists: true, emailConfirmed };
  }

  // 2. Cria o usuário normalmente
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm,
    user_metadata,
  });

  if (error || !data?.user) {
    throw new Error(error?.message || "Falha ao criar usuário no Auth");
  }

  return { user: data.user as SupabaseAuthUser, alreadyExists: false, emailConfirmed: false };
}

export default signUp;
