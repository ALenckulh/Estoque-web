import { isEmailConfirmed } from "@/lib/services/auth/is-email-confirmed";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
    }
    const confirmed = await isEmailConfirmed({
        email,
    });
    return NextResponse.json({ confirmed });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
