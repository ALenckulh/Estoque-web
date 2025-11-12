import { createUser } from "@/lib/services/auth/create-user";
import { NextRequest, NextResponse } from "next/server";

// POST /api/user - Cria um novo usuário.
// Lógica de enterprise:
// - Se is_owner === true: cria uma nova enterprise automaticamente e popula dados base.
// - Se is_owner === false: usa myUserEnterpriseId fornecido (do usuário logado que está criando).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { name, email, password, is_admin, is_owner, myUserEnterpriseId } =
    body || {};

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email e senha são obrigatórios." },
      { status: 400 }
    );
  }
  if (typeof is_owner !== "boolean") {
    return NextResponse.json(
      { error: "is_owner (boolean) é obrigatório." },
      { status: 400 }
    );
  }
  if (typeof is_admin !== "boolean") {
    return NextResponse.json(
      { error: "is_admin (boolean) é obrigatório." },
      { status: 400 }
    );
  }
  if (!is_owner && !myUserEnterpriseId) {
    return NextResponse.json(
      {
        error: "myUserEnterpriseId é obrigatório para usuários não-owner.",
      },
      { status: 400 }
    );
  }

  try {
    const newUser = await createUser({
      name,
      email,
      password,
      is_admin,
      is_owner,
      myUserEnterpriseId,
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao criar usuário." },
      { status: 500 }
    );
  }
}
