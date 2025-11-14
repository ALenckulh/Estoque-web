// app/api/entity/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readEntity } from "@/lib/services/entity/read-entity";
import { updateEntity } from "@/lib/services/entity/update-entity";
import { deleteEntity } from "@/lib/services/entity/delete-entity";

// ✅ GET /api/entity/[id] -> buscar entidade pelo ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

// ✅ PUT /api/entity/[id] -> atualizar entidade
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) throw new Error("ID é obrigatório");

    const updates = await request.json();
    const entity = await updateEntity(id, updates);

    return NextResponse.json({ success: true, entity });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// ✅ PATCH /api/entity/[id] -> ativar/desativar entidade
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) throw new Error("ID é obrigatório");

    const entity = await deleteEntity(id);
    return NextResponse.json({ success: true, entity });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
