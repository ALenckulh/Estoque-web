import { NextResponse, type NextRequest } from "next/server";
import { serverLogOut } from "@/lib/services/auth/log-out-server";

export async function POST(request: NextRequest) {
  try {
    const res = NextResponse.json({ ok: true });
    const { error } = await serverLogOut(request, res);
    if (error) {
      console.error("[sign-out] service error", error);
      return NextResponse.json({ error: error.message || "internal" }, { status: 500 });
    }
    return res;
  } catch (err: any) {
    console.error("[sign-out] unhandled", err);
    return NextResponse.json({ error: err?.message || "internal" }, { status: 500 });
  }
}
