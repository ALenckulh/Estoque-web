import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Cria cliente Supabase para middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Verifica se o usuário está autenticado
  const { data: { user }, error } = await supabase.auth.getUser();
  const isAuthenticated = !!user && !error;

  // Define rotas públicas e de autenticação
  const authRoutes = ["/sign-in", "/sign-up", "/verify-email"];
  const publicRoutes = ["/forgot-password", "/design-system", "/docs"];
  
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isHomePage = pathname === "/";

  // 1. Se está logado e tenta acessar rotas de autenticação → redireciona para home
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Se NÃO está logado e tenta acessar rota protegida → redireciona para login
  if (!isAuthenticated && !isAuthRoute && !isPublicRoute && !isHomePage) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icons, illustrations (public assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|icons|illustrations|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json)$).*)",
  ],
};
