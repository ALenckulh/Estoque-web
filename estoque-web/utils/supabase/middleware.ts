import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "./supabaseServer";

export const config = {
  matcher: ["/protected/:path*"], // protege todas as rotas dentro de /protected
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Cria o client Supabase usando request + response
  const supabase = supabaseServer(request, response);

  // Pega usuário atual e atualiza sessão se necessário
  const { data: { user }, error } = await supabase.auth.getUser();

  // Se não tiver usuário logado, redireciona para /sign-in
  if (!user || error) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return response;
}
