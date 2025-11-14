import { supabase } from "@/utils/supabase/supabaseClient";

/**
 * Retorna o UUID do usuário atualmente logado via Supabase Auth.
 * - Se não houver sessão ou usuário, lança erro.
 * - Usa `auth.getUser()` (client-side) que já considera o token salvo.
 */
export async function findMyUserId(): Promise<string> {
	const { data, error } = await supabase.auth.getUser();
	if (error) {
		throw new Error(`Erro ao obter usuário logado: ${error.message}`);
	}
	if (!data?.user) {
		throw new Error("Nenhum usuário logado.");
	}
	return data.user.id;
}
