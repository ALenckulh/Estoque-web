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
    // Parse filter header/query: prioritize header `x-filter-disableds`, then query `safe_delete`
    const rawHeaderFilter = request.headers.get("x-filter-disableds");
    const url = new URL(request.url);
    const rawQueryFilter = url.searchParams.get("safe_delete");
    let filterDisabled: boolean | undefined;
    if (rawHeaderFilter !== null) {
      filterDisabled = rawHeaderFilter.toLowerCase() === "true";
    } else if (rawQueryFilter !== null) {
      filterDisabled = rawQueryFilter.toLowerCase() === "true";
    } else {
      filterDisabled = undefined;
    }

    const user = await getUserById(id);
    if (!user) {
      return NextResponse.json({ success: false, message: "Usuário não encontrado" }, { status: 404 });
    }
    if (typeof filterDisabled === "boolean" && Boolean(user.safe_delete) !== filterDisabled) {
      return NextResponse.json({ success: false, message: "Usuário não encontrado" }, { status: 404 });
    }

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
    const {
      name,
      admin, // boolean -> is_admin
      // optional email and enterprise_id are ignored here (no update handled)
      currentPassword,
      newPassword,
    } = body as {
      name?: string;
      admin?: boolean;
      currentPassword?: string;
      newPassword?: string;
    };

    const noName = !name;
    const noAdmin = admin === undefined;
    const noPasswordChange = !currentPassword && !newPassword;

    if (noName && noAdmin && noPasswordChange) {
      throw new Error("Nenhum campo para atualizar.");
    }
    const updatedUser = await updateUser(id, {
      name,
      is_admin: admin,
      passwordChange:
        currentPassword && newPassword
          ? { current: currentPassword, next: newPassword }
          : undefined,
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
