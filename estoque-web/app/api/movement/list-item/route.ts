import { NextRequest, NextResponse } from "next/server";
import { listItemMovements } from "@/lib/services/movement/list-item-movements";
import { getItemById } from "@/lib/services/item/read-item";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const itemIdParam = url.searchParams.get("item_id");
    const enterpriseIdParam = url.searchParams.get("enterprise_id");


    const movements = await listItemMovements(Number(itemIdParam), Number(enterpriseIdParam));

    return NextResponse.json({
      success: true,
      movements: movements.map((m: any) => ({
        id: m.id,
        group_id: m.group_id,
        nota_fiscal: m.nota_fiscal,
        date: m.date,
        user_id: m.user_id,
        quantity: m.quantity,
        safe_delete: m.safe_delete,
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Erro ao listar movimentações do item." },
      { status: 500 }
    );
  }
}
