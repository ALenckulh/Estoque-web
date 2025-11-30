// middleware.ts — verifica `users.safe_delete` e protege rotas para usuários desativados
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // coletor local de cookies para aplicar ao NextResponse final
  const cookiesToSet: Array<{ name: string; value: string; options?: any }> = [];

  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookies) {
        cookies.forEach(({ name, value, options }) => {
          cookiesToSet.push({ name, value, options });
        });
      },
    },
  });

  // helper para construir a resposta final e aplicar cookies que o Supabase possa ter setado
  function buildResponse(redirectUrl?: string) {
    const res = redirectUrl ? NextResponse.redirect(new URL(redirectUrl, request.url)) : NextResponse.next();
    cookiesToSet.forEach(({ name, value, options }) => {
      // @ts-ignore - NextResponse.cookies typing in edge may be narrower
      res.cookies.set({ name, value, ...options });
    });
    return res;
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  const isAuthenticated = !!user && !error;

  // se autenticado, buscar a flag safe_delete na tabela users
  if (isAuthenticated && user?.id) {
    try {
      const { data: userRecord, error: dbError } = await supabase
        .from("users")
        .select("safe_delete")
        .eq("id", user.id)
        .single();

      if (dbError) {
        console.error("[middleware] error fetching user.safe_delete:", dbError);
      } else {
        // se a row existe e safe_delete === false, desloga o usuário e bloqueia rotas não públicas
        if (userRecord && userRecord.safe_delete === true) {
          try {
            await supabase.auth.signOut();
            console.log("[middleware] user signed out due to safe_delete === true:", user.id);
          } catch (signOutErr) {
            console.warn("[middleware] signOut error:", signOutErr);
          }

          // redireciona para sign-in caso acesse rota não pública
          const authRoutes = ["/sign-in", "/sign-up", "/verify-email"];
          const publicRoutes = ["/forgot-password", "/design-system", "/docs"];
          const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
          const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
          const isHomePage = pathname === "/";

          if (!isPublicRoute && !isAuthRoute && !isHomePage) {
            return buildResponse("/sign-in");
          }
          // caso contrário, permite acesso a rotas públicas/auth (já deslogado)
        }
      }
    } catch (err) {
      console.error("[middleware] unexpected error checking safe_delete:", err);
    }
  }

  const authRoutes = ["/sign-in", "/sign-up", "/verify-email"];
  const publicRoutes = ["/forgot-password", "/design-system", "/docs"];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isHomePage = pathname === "/";

  console.log("[middleware] path:", pathname, "isAuthenticated:", isAuthenticated);

  if (isAuthenticated && isAuthRoute) return buildResponse("/");
  if (!isAuthenticated && !isAuthRoute && !isPublicRoute && !isHomePage) {
    return buildResponse("/sign-in");
  }
  return buildResponse();
}

export const config = { matcher: [ "/((?!api|_next/static|_next/image|favicon.ico|icons|illustrations|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json)$).*)" ] };