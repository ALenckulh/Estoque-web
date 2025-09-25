// app/api/entity/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createEntity } from "@/lib/services/entity/create-entity";
import { updateEntity } from "@/lib/services/entity/update-entity";
import { readEntity } from "@/lib/services/entity/read-entity";
import { deleteEntity } from "@/lib/services/entity/delete-entity";

// POST -> criar entidade
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const entity = await createEntity(body);
    return NextResponse.json({ success: true, entity });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}



// PUT -> atualizar entidade (passar id e campos no body)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, updates } = body;
    if (!id || !updates) throw new Error("ID e updates são obrigatórios");
    const entity = await updateEntity(id, updates);
    return NextResponse.json({ success: true, entity });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// PATCH -> ativar/desativar entidade (safe delete)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ativo } = body;
    if (!id || typeof ativo !== "boolean") throw new Error("ID e ativo são obrigatórios");
    const entity = await deleteEntity(id, ativo);
    return NextResponse.json({ success: true, entity });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// GET por ID -> buscar entidade pelo id via query param ?id=...
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) throw new Error("ID é obrigatório");

    const entity = await readEntity(id);
    return NextResponse.json({ success: true, entity });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
