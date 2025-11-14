import { NextRequest, NextResponse } from "next/server";
import { createItem } from "@/lib/services/item/create-item";
import { updateItem } from "@/lib/services/item/update-item";
import { deleteItem } from "@/lib/services/item/delete-item";

// POST /api/item -> Cria um novo item
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, quantity, quantity_alert, unit, segment_id, manufacturer, position, group_id, enterprise_id } = body;

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
      unit,
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
}