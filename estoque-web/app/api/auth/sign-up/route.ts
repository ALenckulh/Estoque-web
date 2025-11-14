import { NextRequest, NextResponse } from "next/server";
import signUp from "@/lib/services/auth/sign-up";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, user_metadata } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Força email_confirm = true para evitar bloqueio "Signups not allowed"
    const user = await signUp({
      email,
      password,
      email_confirm: true,
      user_metadata: name
        ? { name, ...(user_metadata || {}) }
        : (user_metadata || undefined),
    });

    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Falha ao criar usuário no Auth" },
      { status: 500 }
    );
  }
}
