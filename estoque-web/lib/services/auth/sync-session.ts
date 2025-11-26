import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/supabaseServer";

type Tokens = {
  access_token: string;
  refresh_token: string;
};

/**
 * Sincroniza a sessão do Supabase no servidor gravando cookies HttpOnly
 * usando o helper supabaseServer (que já encapsula envs e cookies).
 */
export async function syncServerSession(
  request: NextRequest,
  response: NextResponse,
  tokens: Tokens
) {
  const supabase = supabaseServer(request, response);
  const { data, error } = await supabase.auth.setSession(tokens);
  return { data, error };
}
