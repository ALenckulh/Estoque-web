import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

function normalizeSession(resultData: any) {
  if (!resultData) return null;

  // Supabase may return { session: { access_token, refresh_token, expires_in } }
  const maybe = resultData.session ?? resultData;
  if (!maybe || typeof maybe !== "object") return null;

  return {
    access_token: maybe.access_token ?? null,
    refresh_token: maybe.refresh_token ?? null,
    expires_in: maybe.expires_in ?? null,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token_hash = typeof body?.token_hash === "string" ? body.token_hash : undefined;

    if (!token_hash) {
      return NextResponse.json({ error: "token_hash is required" }, { status: 400 });
    }

    // Prefer the typed `token_hash` shape. If the SDK behaves differently in some
    // environments, try a second call using a loose `any` cast as a fallback.
    let result = await supabaseAdmin.auth.verifyOtp({ token_hash: token_hash, type: "recovery" } as any);

    if (result.error) {
      // fallback: try using `token` field in case some runtime expects that shape
      result = await supabaseAdmin.auth.verifyOtp({ token: token_hash, type: "recovery" } as any);
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message || "Invalid or expired token" }, { status: 400 });
    }

    const session = normalizeSession(result.data);

    return NextResponse.json({ ok: true, session });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
