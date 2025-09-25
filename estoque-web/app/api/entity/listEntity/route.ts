import { listEntities } from "@/lib/services/entity/list-entities";
import { NextResponse } from "next/server";

// GET -> listar todas entidades
export async function GET() {
  try {
    const entities = await listEntities();
    return NextResponse.json({ success: true, entities });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}