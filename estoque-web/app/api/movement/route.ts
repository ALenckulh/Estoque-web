import { NextRequest, NextResponse } from "next/server";
import { listMovements } from "@/lib/services/movement/list-movements";
import { createMovement } from "@/lib/services/movement/create-movement";

// GET → listar movimentações
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const enterpriseId = url.searchParams.get("enterprise_id");

    // Parse filter header/query for disabled flag (safe_delete)
    // Accept header `x-filter-disabled` (preferred) or legacy `x-filter-disableds`;
    // Accept query `safe_delete` or `disabled`.
    const rawHeaderPrimary = req.headers.get("x-filter-disabled");
    const rawHeaderLegacy = req.headers.get("x-filter-disableds");
    const rawQueryFilter = url.searchParams.get("safe_delete") ?? url.searchParams.get("disabled");
    let filterDisabled: boolean | undefined;
    const raw = rawHeaderPrimary ?? rawHeaderLegacy;
    if (raw !== null) {
      const v = raw.trim().toLowerCase();
      filterDisabled = v === "true" || v === "1";
    } else if (rawQueryFilter !== null) {
      const v = rawQueryFilter.trim().toLowerCase();
      filterDisabled = v === "true" || v === "1";
    } else {
      filterDisabled = undefined;
    }

    // Parse type filter: entrada (quantity > 0) or saida (quantity < 0)
    const typeFilter = url.searchParams.get("type")?.trim().toLowerCase();
    const filterType: "entrada" | "saida" | undefined =
      typeFilter === "entrada" || typeFilter === "saida" ? typeFilter : undefined;

    // Pass filters to service; DB handles filtering
    const movements = await listMovements({
      enterpriseId,
      filters: {
        safe_delete: filterDisabled,
        type: filterType,
      },
    });

    return NextResponse.json({ success: true, movements });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Erro ao listar movimentações." },
      { status: 500 }
    );
  }
}

// POST → criar movimentação
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createMovement(body as any);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Erro ao criar movimentação." },
      { status: 500 }
    );
  }
}