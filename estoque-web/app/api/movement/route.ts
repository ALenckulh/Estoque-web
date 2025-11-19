import { NextRequest, NextResponse } from "next/server";
import { listMovements } from "@/lib/services/movement/list-movements";
import { createMovement } from "@/lib/services/movement/create-movement";

// GET → listar movimentações
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const enterpriseId = url.searchParams.get("enterprise_id");

    const movements = await listMovements({ enterpriseId });

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