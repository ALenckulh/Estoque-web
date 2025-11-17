import type { NextRequest } from "next/server";
import { supabaseServer } from "@/utils/supabase/supabaseServer";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

/**
 * Verifica se já existe um registro na tabela `users` para o usuário autenticado.
 * Retorna { exists: boolean, user?: any, error?: any }
 */
export async function checkAppUser(request: NextRequest, response: Response) {
  try {
    const supabase = supabaseServer(request as any, response as any);

    const { data: authRes, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authRes?.user) {
      return { exists: false, error: authErr || new Error("No auth user available") };
    }

    const authId = authRes.user.id;

    // sua tabela users usa PK `id` que referencia auth.users(id)
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authId)
      .limit(1)
      .maybeSingle();

    if (error) return { exists: false, error };
    if (user) return { exists: true, user };

    // Nenhum app user encontrado. Opcionalmente remover o usuário do Auth via Admin API.
    try {
      const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(authId);
      if (delErr) {
        return { exists: false, deleted: false, error: delErr };
      }
      return { exists: false, deleted: true };
    } catch (err: any) {
      return { exists: false, deleted: false, error: err };
    }
  } catch (err: any) {
    return { exists: false, error: err };
  }
}

export default checkAppUser;
