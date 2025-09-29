import { listItems } from "@/lib/services/item/list-items";
import { NextResponse } from "next/server";

// GET -> listar todos itens
export async function GET() {
  try {
    const items = await listItems();
    return NextResponse.json({ success: true, items });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
