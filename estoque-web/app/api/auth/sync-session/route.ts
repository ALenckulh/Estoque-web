// arquivo: app/api/auth/sync-session/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { syncServerSession } from "@/lib/services/auth/sync-session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { access_token, refresh_token, expires_in } = body ?? {};

    if (!access_token || !refresh_token) {
      return NextResponse.json(
        { error: "access_token and refresh_token are required" },
        { status: 400 }
      );
    }

    // Prepara a resposta e delega ao service para setar cookies via supabaseServer
    const res = NextResponse.json({ ok: true });
    const { error } = await syncServerSession(request, res, {
      access_token,
      refresh_token,
    });

    if (error) {
      console.error("[sync-session] setSession error", error);
      return NextResponse.json({ error: error.message || "internal" }, { status: 500 });
    }

    console.log("[sync-session] session synced via service");
    return res;
  } catch (err: any) {
    console.error("[sync-session] error", err);
    return NextResponse.json({ error: err?.message || "internal" }, { status: 500 });
  }
}