import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import { User as SupabaseAuthUser } from "@supabase/supabase-js";

export interface isEmailConfirmedParams {
  email: string;
  email_confirm?: boolean;
  user_metadata?: Record<string, any>;
}

/**
 * Cria um usuário no Supabase Auth usando a Admin API (service role).
 * Retorna o objeto de usuário do Supabase Auth.
 */

export async function isEmailConfirmed(
  params: isEmailConfirmedParams
): Promise<{
  user: SupabaseAuthUser | null;
  alreadyExists: boolean;
  emailConfirmed: boolean;
}> {
  const { email } = params;
  const existing = await supabaseAdmin.auth.admin.listUsers();
  const user = existing.data?.users?.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase()
  );
  if (user) {
    // Usuário já existe
    const emailConfirmed = !!user.email_confirmed_at;
    return { user, alreadyExists: true, emailConfirmed };
  }
  // Usuário não existe
  return { user: null, alreadyExists: false, emailConfirmed: false };
}
