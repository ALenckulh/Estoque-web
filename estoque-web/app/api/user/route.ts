import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/services/user/create-user";
import { getUserById } from "@/lib/services/user/read-user";
import { updateUser } from "@/lib/services/user/update-user";
import { deleteUser } from "@/lib/services/user/delete-user";

// GET /api/user/[id] → Buscar usuário pelo ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) throw new Error("ID é obrigatório");

    const user = await getUserById(Number(id));
    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// POST /api/user → Criar usuário
export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { error: "Método não permitido" },
      { status: 405 }
    );
  }

  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Nome, senha e email são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    const newUser = await createUser({ name, email, password });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar usuário." },
      { status: 500 }
    );
  }
}

// PUT /api/user?id=1 → Atualizar usuário
export async function PUT(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "ID é obrigatório." }, { status: 400 });
  }

  const { name, email, password, admin, enterprise_id } = await req.json();

  if (
    !name &&
    !email &&
    !password &&
    admin === undefined &&
    enterprise_id === undefined
  ) {
    return NextResponse.json(
      { error: "Nenhum campo para atualizar." },
      { status: 400 }
    );
  }

  try {
    const updatedUser = await updateUser(id, {
      name,
      email,
      password,
      admin,
      enterprise_id,
    });
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/user?id=1 → Remover usuário (soft delete)
export async function DELETE(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "ID é obrigatório." }, { status: 400 });
  }

  try {
    const deletedUser = await deleteUser(id);
    return NextResponse.json(deletedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}