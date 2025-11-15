import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/supabaseServer";

/**
 * Server-side logout: usa supabaseServer (que opera sobre request/response)
 * e delega ao supabase.auth.signOut() para expirar cookies HttpOnly.
 */
export async function serverLogOut(request: NextRequest, response: NextResponse) {
  const supabase = supabaseServer(request, response);
  const { error } = await supabase.auth.signOut();
  return { error };
}

export default serverLogOut;
