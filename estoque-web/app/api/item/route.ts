import { NextRequest, NextResponse } from "next/server";
import { createItem } from "@/lib/services/item/create-item";
import { updateItem } from "@/lib/services/item/update-item";
import { deleteItem } from "@/lib/services/item/delete-item";

// POST /api/item -> Cria um novo item
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, quantity_alert, unit, segment_id, manufacturer, position, group_id, enterprise_id } = body;

  if (!name || enterprise_id == null) {
    return NextResponse.json(
      { error: "Nome e enterprise_id são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    const newItem = await createItem({
      name,
      description,
      quantity_alert,
      unit_id: body.unit_id ?? (unit != null ? Number(unit) : undefined),
      segment_id,
      manufacturer,
      position,
      group_id,
      enterprise_id,
    });
    // Retornar o item criado incluindo o id
    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao criar item." },
      { status: 500 }
    );
  }
}