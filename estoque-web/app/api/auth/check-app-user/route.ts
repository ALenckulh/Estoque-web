import { NextResponse, type NextRequest } from "next/server";
import { checkAppUser } from "@/lib/services/auth/check-app-user";

export async function POST(request: NextRequest) {
  try {
    const res = NextResponse.json({ ok: true });
    const result = await checkAppUser(request, res as any);
    if (result.error) {
      console.error("[check-app-user] error", result.error);
      return NextResponse.json({ error: result.error?.message || result.error }, { status: 500 });
    }
    return NextResponse.json({ ok: true, exists: result.exists, deleted: result.deleted ?? false, user: result.user ?? null });
  } catch (err: any) {
    console.error("[check-app-user] unhandled", err);
    return NextResponse.json({ error: err?.message || "internal" }, { status: 500 });
  }
}
