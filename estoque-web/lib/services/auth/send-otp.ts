import { supabase } from "@/utils/supabase/supabaseClient";

/**
 * Envia um código OTP por e-mail usando Supabase.
 * Retorna true em caso de sucesso, lança erro em falha.
 */
export async function sendOtp(email: string): Promise<boolean> {
  if (!email || typeof email !== "string") {
    throw new Error("E-mail inválido");
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, // evita tentativa de signup quando já criamos usuário via Admin API
    },
  });

  if (error) {
    throw new Error(error.message || "Falha ao enviar código");
  }

  return true;
}

export default sendOtp;
