import { NextRequest, NextResponse } from "next/server";
import { readEntity } from "@/lib/services/entity/read-entity";
import { listEntityMovements } from "@/lib/services/entity/list-entity-movements";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID da entidade é obrigatório." }, { status: 400 });
    }

    const entity = await readEntity(id);
    if (!entity) {
      return NextResponse.json({ success: false, message: "Entidade não encontrada." }, { status: 404 });
    }

    const participateId = Number(entity.id); // ✅ usar id da entidade
    const enterpriseId = Number(entity.enterprise_id);

    if (!participateId || !enterpriseId) {
      return NextResponse.json({ success: false, message: "Participate ID ou Enterprise ID inválido." }, { status: 400 });
    }

    const movements = await listEntityMovements(participateId, enterpriseId);

    const historico_movimentacao = (movements || []).map((m: any) => ({
      id_mov: m.id,
      id_grupo: m.group_id,
      nota_fiscal: m.nota_fiscal,
      data_movimentacao: m.date, // ou movement_date, dependendo da coluna
      usuario_responsavel: m.user_id,
      quantidade_movimentada: m.quantity,
      safe_delete: m.safe_delete,
    }));

    return NextResponse.json({ success: true, historico_movimentacao });
  } catch (err: any) {
    console.error("Erro no endpoint list-entity-movements:", err);
    return NextResponse.json({ success: false, message: "Erro interno ao buscar histórico de movimentações." }, { status: 500 });
  }
}
