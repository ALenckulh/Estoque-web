// /lib/services/entity/list-entity-movements.ts
import { listEntityMovementsDB as listEntityMovementsDB } from "@/lib/data-base/entity/list-entity-movements";

/**
 * Lista todas as movimentações de uma entidade específica em uma empresa.
 * Retorna um array seguro, mesmo em caso de erro.
 */
export async function listEntityMovements(
  participate_id: number,
  enterprise_id: number,
  filters?: {
    safe_delete?: boolean;
    type?: "entrada" | "saida";
  }
) {
  try {
    const data = await listEntityMovementsDB(participate_id, enterprise_id, filters);
    return data ?? [];
  } catch (error: any) {
    console.error("Erro no service listEntityMovements:", error);
    return []; // Retorna array vazio em caso de erro
  }
}
