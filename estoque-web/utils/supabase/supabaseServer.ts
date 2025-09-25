import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./env";

/**
 * Cria um Supabase client no servidor.
 * Funciona para Server Components e Middleware.
 * @param request - NextRequest (necessário para Middleware)
 * @param response - NextResponse (opcional, necessário para Middleware setar cookies)
 */
export const supabaseServer = (request: NextRequest, response?: Response) => {
  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            if (response && "cookies" in response) {
              // Middleware precisa do response
              // @ts-ignore
              response.cookies.set({ name, value, ...options });
            } else {
              // Server Component / Server Action
              request.cookies.set({ name, value, ...options });
            }
          });
        },
      },
    }
  );
};
