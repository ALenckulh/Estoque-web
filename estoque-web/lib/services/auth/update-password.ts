import { supabase } from "@/utils/supabase/supabaseClient";

/**
 * Atualiza a senha do usuário autenticado.
 * Requer que o usuário tenha clicado no link de recuperação enviado por email.
 * 
 * @param newPassword - Nova senha
 * @returns true em caso de sucesso
 * @throws Error com mensagem amigável em caso de falha
 */
export async function updatePassword(newPassword: string): Promise<boolean> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(error.message || "Falha ao atualizar senha");
    }

    return true;
  } catch (err: any) {
    throw new Error(err?.message || String(err));
  }
}

export default updatePassword;
