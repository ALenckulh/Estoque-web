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
<<<<<<< HEAD
}
=======
}
>>>>>>> 5623cfa (Implementa Item CRUD: model, database, services e routes além de alguns ajustes pontuais e adição do listUser)
