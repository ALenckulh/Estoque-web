import { NextRequest, NextResponse } from "next/server";
import { listMovements } from "@/lib/services/movement/list-movements";
import { createMovement } from "@/lib/services/movement/create-movement";

// GET → listar movimentações
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const enterpriseId = url.searchParams.get("enterprise_id");

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

    const movements = await listMovements({ enterpriseId });
    const filtered = filterDisabled === undefined ? movements : (movements || []).filter((m: any) => Boolean(m.safe_delete) === filterDisabled);

    return NextResponse.json({ success: true, movements: filtered });
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