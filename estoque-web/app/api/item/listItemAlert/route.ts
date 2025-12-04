import { listItemsWithAlerts } from "@/lib/services/item/list-items-with-alerts";
import { NextResponse } from "next/server";

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

    const { totalNegativo, totalAlerta } = await listItemsWithAlerts(enterprise_id);

    return NextResponse.json({
      success: true,
      totalNegativo,
      totalAlerta
    });

  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
