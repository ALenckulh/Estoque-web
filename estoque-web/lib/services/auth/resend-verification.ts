import { supabase } from "@/utils/supabase/supabaseClient";

/**
 * Reenvia o e-mail de verificação de cadastro (signup) para o e-mail fornecido.
 * Retorna `true` se a chamada foi realizada (não necessariamente indica entrega),
 * `false` em caso de falha.
 */
export default async function resendVerificationEmail(email: string): Promise<boolean> {
  try {
    await supabase.auth.resend({ type: "signup", email });
    return true;
  } catch (err) {
    // Falha no reenvio não quebra o fluxo do usuário; apenas retorna false
    return false;
  }
}
