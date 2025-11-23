import { NextRequest, NextResponse } from "next/server";
import { getItemById } from "@/lib/services/item/read-item";
import { listItemMovements } from "@/lib/services/movement/list-item-movements";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID é obrigatório." },
        { status: 400 }
      );
    }

    // 1️⃣ Busca o item
    const item = await getItemById(Number(id));
    if (!item) {
      return NextResponse.json(
        { success: false, message: "Item não encontrado." },
        { status: 404 }
      );
    }

    // 2️⃣ Busca movimentações diretamente pelo item_id
    const movements = await listItemMovements(item.id!, item.enterprise_id!);

    // 3️⃣ Retorno organizado
    return NextResponse.json({
      success: true,
      historico_movimentacao: movements.map((m: any) => ({
        id_mov: m.id,
        id_grupo: m.group_id,
        nota_fiscal: m.nota_fiscal,
        data_movimentacao: m.data_movimentacao,
        usuario_responsavel: m.user_id,
        quantidade_movimentada: m.quantity,
        safe_delete: m.safe_delete,
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}