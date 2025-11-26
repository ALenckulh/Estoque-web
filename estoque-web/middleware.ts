// middleware.ts (exemplo simplificado)
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // só setar no response — vamos usar response.cookies.set
        cookiesToSet.forEach(({ name, value, options }) => {
          // @ts-ignore
          response.cookies.set({ name, value, ...options });
        });
      },
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  const isAuthenticated = !!user && !error;

  const authRoutes = ["/sign-in", "/sign-up", "/verify-email"];
  const publicRoutes = ["/forgot-password", "/design-system", "/docs"];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isHomePage = pathname === "/";

  console.log("[middleware] path:", pathname, "isAuthenticated:", isAuthenticated);

  if (isAuthenticated && isAuthRoute) return NextResponse.redirect(new URL("/", request.url));
  if (!isAuthenticated && !isAuthRoute && !isPublicRoute && !isHomePage) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return response;
}

export const config = { matcher: [ "/((?!api|_next/static|_next/image|favicon.ico|icons|illustrations|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json)$).*)" ] };