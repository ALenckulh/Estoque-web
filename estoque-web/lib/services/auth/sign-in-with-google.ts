import { supabaseBrowser } from "@/utils/supabase/supabaseBrowserClient";

/**
 * Inicia fluxo de autenticação OAuth com o provedor Google via Supabase.
 * - Se usado no cliente, a função normalmente redireciona o usuário para a
 *   página de consentimento do Google e o Supabase cuidará do callback.
 * - `redirectTo` pode ser passado para sobrescrever o callback URL (por exemplo
 *   process.env.NEXT_PUBLIC_SIGN_IN_WITH_GOOGLE).
 * Retorna o objeto `data` do supabase em caso de sucesso (pode conter `url` quando
 * usando redirect).
 */
export async function signInWithGoogle(redirectTo?: string) {
	try {
		const options = redirectTo
			? { redirectTo }
			: undefined;

		const { data, error } = await supabaseBrowser.auth.signInWithOAuth({
			provider: "google",
			options,
		});

		if (error) {
			throw new Error(error.message || "Falha ao iniciar login com Google");
		}

		return data;
	} catch (err: any) {
		throw new Error(err?.message || String(err));
	}
}

export default signInWithGoogle;

