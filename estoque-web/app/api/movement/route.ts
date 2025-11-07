import { NextResponse } from "next/server";
import { listMovements } from "@/lib/services/movement/list-movements";
import { createMovement } from "@/lib/services/movement/create-movement";

// GET → listar movimentações
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const groupId = url.searchParams.get("group_id");
    const userId = url.searchParams.get("user_id");
    const enterpriseId = url.searchParams.get("enterprise_id");
    const page = Number(url.searchParams.get("page") || 1);
    const pageSize = Number(url.searchParams.get("pageSize") || 20);

    const movements = await listMovements({
      groupId,
      userId,
      enterpriseId,
      page,
      pageSize,
    });

    return NextResponse.json(movements);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro ao listar movimentações." },
      { status: 500 }
    );
  }
}

// POST → criar movimentação
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await createMovement(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro ao criar movimentação." },
      { status: 500 }
    );
  }
}