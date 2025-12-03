import { listUsers } from "@/lib/services/user/list-users";
import { NextResponse } from "next/server";

// GET -> listar todos usuários
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
    // Parse filter header/query: prioritize header `x-filter-disableds`, then query `safe_delete`
    const rawHeaderFilter = request.headers.get("x-filter-disableds");
    const rawQueryFilter = searchParams.get("safe_delete");
    let filterDisabled: boolean | undefined;
    if (rawHeaderFilter !== null) {
      filterDisabled = rawHeaderFilter.toLowerCase() === "true";
    } else if (rawQueryFilter !== null) {
      filterDisabled = rawQueryFilter.toLowerCase() === "true";
    } else {
      filterDisabled = undefined;
    }

    // Pass filters to service; DB handles filtering
    const users = await listUsers(enterprise_id, {
      safe_delete: filterDisabled,
    });

    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}