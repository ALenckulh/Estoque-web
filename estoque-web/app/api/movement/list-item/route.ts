import { NextRequest, NextResponse } from "next/server";
import { listItemMovements } from "@/lib/services/movement/list-item-movements";

// GET -> listar movimentações de um item
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const itemIdParam = url.searchParams.get("item_id");
    const enterpriseIdParam = url.searchParams.get("enterprise_id");

    // Parse filter header/query: prioritize header `x-filter-disableds`, then query `safe_delete`
    const rawHeaderFilter = req.headers.get("x-filter-disableds");
    const rawQueryFilter = url.searchParams.get("safe_delete");
    let filterDisabled: boolean | undefined;
    if (rawHeaderFilter !== null) {
      filterDisabled = rawHeaderFilter.toLowerCase() === "true";
    } else if (rawQueryFilter !== null) {
      filterDisabled = rawQueryFilter.toLowerCase() === "true";
    } else {
      filterDisabled = undefined;
    }

    const movements = await listItemMovements(Number(itemIdParam), Number(enterpriseIdParam));

    const filtered = filterDisabled === undefined ? movements : (movements || []).filter((m: any) => Boolean(m.safe_delete) === filterDisabled);

    return NextResponse.json({
      success: true,
      movements: filtered.map((m: any) => ({
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
