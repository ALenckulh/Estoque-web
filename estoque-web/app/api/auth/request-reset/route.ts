import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : undefined;
    let redirectTo = typeof body?.redirectTo === "string" && body.redirectTo ? body.redirectTo : undefined;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!redirectTo && process.env.NEXT_PUBLIC_SITE_URL) {
      redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/forgot-password/reset-password`;
    }

    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      return NextResponse.json({ error: error.message || "Failed to request password reset" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
