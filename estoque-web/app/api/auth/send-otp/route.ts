import { NextRequest, NextResponse } from "next/server";
import sendOtp from "@/lib/services/auth/send-otp";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
    }

    // Envia OTP via serviço (por padrão não cria usuário novo)
    await sendOtp(email);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
