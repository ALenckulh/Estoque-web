import { supabaseBrowser } from "@/utils/supabase/supabaseBrowserClient";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

/**
 * Faz login no Supabase Auth usando email + senha.
 * Retorna o objeto `data` do supabase ({ user, session }) em caso de sucesso.
 * Lança Error com mensagem amigável em caso de falha.
 */

export async function signInWithEmail(email: string, password: string) {

	try {
		const { data, error } = await supabaseBrowser.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			throw new Error(error.message || "Falha ao autenticar");
		}

		return { ...data, requireEmailVerification: false };
	} catch (err: any) {
		throw new Error(err?.message || String(err));
	}
}

export default signInWithEmail;

