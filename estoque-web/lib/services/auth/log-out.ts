import { supabaseBrowser } from "@/utils/supabase/supabaseBrowserClient";

/**
 * Faz logout no Supabase Auth, invalidando a sessão atual.
 * Retorna true em caso de sucesso.
 * Lança Error com mensagem amigável em caso de falha.
 */
export async function logOut(): Promise<boolean> {
  try {
    const { error } = await supabaseBrowser.auth.signOut();

    if (error) {
      throw new Error(error.message || "Falha ao fazer logout");
    }
    // Também limpa as cookies HttpOnly no servidor para o middleware parar de autenticar
    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
        credentials: "same-origin",
      });
    } catch (e) {
      // Não bloquear o fluxo de logout do cliente caso a chamada falhe
      // O token já foi revogado no Supabase e o localStorage limpo
      // O middleware deve parar de autenticar assim que os cookies expirarem
      // ou no próximo ciclo de refresh falho.
    }

    return true;
  } catch (err: any) {
    throw new Error(err?.message || String(err));
  }
}

export default logOut;
