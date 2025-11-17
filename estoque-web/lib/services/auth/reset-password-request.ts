import { supabase } from "@/utils/supabase/supabaseClient";

/**
 * Envia email de recuperação de senha com link de redefinição.
 * O Supabase enviará um email com um link que redireciona para a URL especificada.
 * 
 * @param email - Email do usuário que esqueceu a senha
 * @returns true em caso de sucesso
 * @throws Error com mensagem amigável em caso de falha
 */
export async function resetPasswordRequest(email: string): Promise<boolean> {
  try {
    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/forgot-password/reset-password` : undefined;

    const res = await fetch("/api/auth/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, redirectTo }),
      credentials: "same-origin",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Falha ao enviar email de recuperação");
    }

    return true;
  } catch (err: any) {
    throw new Error(err?.message || String(err));
  }
}

export default resetPasswordRequest;
