import { NextRequest, NextResponse } from "next/server";
import { toggleMovementSafeDelete } from "@/lib/services/movement/toggle-movement-safe-delete";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { group_id, enterprise_id } = body;

    if (typeof group_id !== "number" || typeof enterprise_id !== "number") {
      return NextResponse.json(
        { success: false, message: "Campos 'group_id' e 'enterprise_id' devem ser números." },
        { status: 400 }
      );
    }

    const result = await toggleMovementSafeDelete({ group_id, enterprise_id });

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Erro ao alternar safe_delete." },
      { status: 500 }
    );
  }
}
