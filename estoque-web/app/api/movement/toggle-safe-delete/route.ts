import { NextRequest, NextResponse } from "next/server";
import { toggleMovementSafeDelete } from "@/lib/services/movement/toggle-movement-safe-delete";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let { group_id, movement_id, enterprise_id } = body;

    // Coerce possible string inputs to numbers
    if (typeof enterprise_id === "string") enterprise_id = Number(enterprise_id);
    if (typeof group_id === "string") group_id = Number(group_id);
    if (typeof movement_id === "string") movement_id = Number(movement_id);

    if (typeof enterprise_id !== "number") {
      return NextResponse.json(
        { success: false, message: "Campo 'enterprise_id' deve ser número." },
        { status: 400 }
      );
    }

    const hasGroup = typeof group_id === "number" && group_id > 0;
    const hasMovement = typeof movement_id === "number" && movement_id > 0;

    if (!hasGroup && !hasMovement) {
      return NextResponse.json(
        { success: false, message: "Informe 'movement_id' (linha) ou 'group_id' (grupo)." },
        { status: 400 }
      );
    }

    const result = await toggleMovementSafeDelete({ group_id, movement_id, enterprise_id });

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Erro ao alternar safe_delete." },
      { status: 500 }
    );
  }
}
