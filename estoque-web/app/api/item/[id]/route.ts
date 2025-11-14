import { NextRequest, NextResponse } from "next/server";
import { getItemById } from "@/lib/services/item/read-item";
import { updateItem } from "@/lib/services/item/update-item";
import { deleteItem } from "@/lib/services/item/delete-item";

// ✅ GET /api/item/[id] -> Buscar item pelo ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) throw new Error("ID é obrigatório");

    const item = await getItemById(Number(id));
    return NextResponse.json({ success: true, item });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// ✅ PUT /api/item/[id] -> Atualizar item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) throw new Error("ID é obrigatório");

    const body = await request.json();
    const updatedItem = await updateItem(Number(id), body);

    return NextResponse.json(
      { success: true, item: updatedItem },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE /api/item/[id] -> Remover item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) throw new Error("ID é obrigatório");

    const deletedItem = await deleteItem(Number(id));

    return NextResponse.json(
      { success: true, item: deletedItem },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
