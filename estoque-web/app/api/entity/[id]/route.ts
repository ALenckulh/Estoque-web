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

    // Parse filter header/query: prioritize header `x-filter-disableds`, then query `safe_delete`
    const rawHeaderFilter = _request.headers.get("x-filter-disableds");
    const url = new URL(_request.url);
    const rawQueryFilter = url.searchParams.get("safe_delete");
    let filterDisabled: boolean | undefined;
    if (rawHeaderFilter !== null) {
      filterDisabled = rawHeaderFilter.toLowerCase() === "true";
    } else if (rawQueryFilter !== null) {
      filterDisabled = rawQueryFilter.toLowerCase() === "true";
    } else {
      filterDisabled = undefined;
    }

    const entity = await readEntity(id);
    if (!entity) {
      return NextResponse.json({ success: false, message: "Entidade não encontrada" }, { status: 404 });
    }
    // Se o filtro foi fornecido e não bater com o registro, retorna 404
    if (typeof filterDisabled === "boolean" && Boolean(entity.safe_delete) !== filterDisabled) {
      return NextResponse.json({ success: false, message: "Entidade não encontrada" }, { status: 404 });
    }

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
