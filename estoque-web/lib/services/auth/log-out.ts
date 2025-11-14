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

    return true;
  } catch (err: any) {
    throw new Error(err?.message || String(err));
  }
}

export default logOut;