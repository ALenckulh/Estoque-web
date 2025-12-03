import { listItems } from "@/lib/services/item/list-items";
import { NextResponse } from "next/server";

// GET -> listar todos itens
export async function GET(request: Request) {
  try {
    const headerEnterpriseId = request.headers.get("x-enterprise-id");
    const { searchParams } = new URL(request.url);
    const queryEnterpriseId = searchParams.get("enterprise_id");
    const rawEnterpriseId = headerEnterpriseId || queryEnterpriseId;
    if (!rawEnterpriseId) {
      return NextResponse.json(
        { success: false, message: "enterprise_id não informado (header x-enterprise-id ou query ?enterprise_id=)" },
        { status: 400 }
      );
    }
    const enterprise_id = Number(rawEnterpriseId);
    if (Number.isNaN(enterprise_id) || enterprise_id <= 0) {
      return NextResponse.json(
        { success: false, message: "enterprise_id inválido" },
        { status: 400 }
      );
    }

    // Filtros
    const group_id = searchParams.get("group_id");
    const created_at = searchParams.get("created_at");
    const unit_id = searchParams.get("unit_id");
    const safe_delete = searchParams.get("safe_delete");
    const quantity = searchParams.get("quantity");

    const filters: any = {
      group_id: group_id ? Number(group_id) : undefined,
      created_at: created_at || undefined,
      unit_id: unit_id ? Number(unit_id) : undefined,
      safe_delete: safe_delete !== null ? (safe_delete === "true" ? true : safe_delete === "false" ? false : undefined) : undefined,
      quantity: quantity || undefined,
    };

    const items = await listItems(enterprise_id, filters);
    return NextResponse.json({ success: true, items });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
