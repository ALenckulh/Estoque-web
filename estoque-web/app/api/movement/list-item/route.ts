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

    // Parse type filter
    const typeFilter = url.searchParams.get("type");
    const typeValue = typeFilter === "entrada" || typeFilter === "saida" ? typeFilter : undefined;

    // Build filters object
    const filters: { safe_delete?: boolean; type?: "entrada" | "saida" } = {};
    if (filterDisabled !== undefined) filters.safe_delete = filterDisabled;
    if (typeValue) filters.type = typeValue;

    const movements = await listItemMovements(
      Number(itemIdParam),
      Number(enterpriseIdParam),
      Object.keys(filters).length > 0 ? filters : undefined
    );

    return NextResponse.json({ success: true, movements });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Erro ao listar movimentações do item." },
      { status: 500 }
    );
  }
}
