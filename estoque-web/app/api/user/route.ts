import { createUser } from "@/lib/services/user/create-user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      name,
      is_admin = false,
      is_owner = false,
      myUserEnterpriseId = null,
    } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const newUser = await createUser({
      email: String(email).trim(),
      password: String(password),
      is_admin: Boolean(is_admin),
      is_owner: Boolean(is_owner),
      name: typeof name === "string" ? name : undefined,
      myUserEnterpriseId: myUserEnterpriseId ?? undefined,
    });

    console.log("[api/auth/sign-up] created app user id:", newUser?.id ?? null);

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (err: any) {
    console.error("[api/auth/sign-up] error:", err);
    const message = err?.message || "Falha ao criar usuário";
    const status = err?.statusCode || 500;
    return NextResponse.json({ error: message }, { status });
  }
}
