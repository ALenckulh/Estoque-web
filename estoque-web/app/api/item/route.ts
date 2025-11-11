import { NextRequest, NextResponse } from "next/server";
import { createItem } from "@/lib/services/item/create-item";
<<<<<<< HEAD
import { updateItem } from "@/lib/services/item/update-item";
import { deleteItem } from "@/lib/services/item/delete-item";

=======
import { getItemById } from "@/lib/services/item/read-item";
import { updateItem } from "@/lib/services/item/update-item";
import { deleteItem } from "@/lib/services/item/delete-item";

// GET /api/item/[id] -> buscar item pelo ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

>>>>>>> 5623cfa (Implementa Item CRUD: model, database, services e routes além de alguns ajustes pontuais e adição do listUser)
// POST /api/item -> Cria um novo item
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, quantity, quantity_alert, unity, segment_id, manufacturer, position, group_id, enterprise_id } = body;

  if (!name || !quantity || !enterprise_id) {
    return NextResponse.json(
      { error: "Nome, quantidade e enterprise_id são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    const newItem = await createItem({
      name,
      description,
      quantity,
      quantity_alert,
      unity,
      segment_id,
      manufacturer,
      position,
      group_id,
      enterprise_id,
    });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao criar item." },
      { status: 500 }
    );
  }
<<<<<<< HEAD
=======
}

// PUT /api/item?id=1 -> Atualiza um item
export async function PUT(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "ID é obrigatório." }, { status: 400 });
  }

  const body = await req.json();

  try {
    const updatedItem = await updateItem(id, body);
    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/item?id=1 -> Remove um item
export async function DELETE(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "ID é obrigatório." }, { status: 400 });
  }

  try {
    const deletedItem = await deleteItem(id);
    return NextResponse.json(deletedItem, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
>>>>>>> 5623cfa (Implementa Item CRUD: model, database, services e routes além de alguns ajustes pontuais e adição do listUser)
}