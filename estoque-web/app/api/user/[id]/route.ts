import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/lib/services/user/read-user";
import { updateUser } from "@/lib/services/user/update-user";
import { deleteUser } from "@/lib/services/user/delete-user";

// GET /api/user/[id] -> buscar usuário pelo ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) throw new Error("ID é obrigatório");

  const user = await getUserById(id);
    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// PUT /api/user/[id] -> Atualiza um usuário
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) throw new Error("ID é obrigatório");

    const body = await request.json();
    const { name, email, password, admin, enterprise_id } = body;

    if (!name && !email && !password && admin === undefined) {
      throw new Error("Nenhum campo para atualizar.");
    }
    const updatedUser = await updateUser(id, {
      name,
      password,
      is_admin: admin,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// DELETE /api/user/[id] -> Remove um usuário
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) throw new Error("ID é obrigatório");

  const deletedUser = await deleteUser(id);
    return NextResponse.json({ success: true, user: deletedUser });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
