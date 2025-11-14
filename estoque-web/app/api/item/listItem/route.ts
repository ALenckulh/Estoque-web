import { listItems } from "@/lib/services/item/list-items";
import { NextResponse } from "next/server";

// GET -> listar todos itens
export async function GET(request: Request) {
  try {
    // 1. Tenta obter enterprise_id do header (ex: x-enterprise-id)
    const headerEnterpriseId = request.headers.get("x-enterprise-id");
    // 2. Ou da query string (?enterprise_id=123)
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
    const items = await listItems(enterprise_id);
    return NextResponse.json({ success: true, items });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
