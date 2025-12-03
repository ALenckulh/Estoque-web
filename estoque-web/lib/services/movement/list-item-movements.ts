// lib/services/movement/list-item-movements.ts
import { fetchMovementsByItem } from "@/lib/data-base/movement/fetch-movements-by-item";

/**
 * Lista histórico de movimentações de um item.
 * Lança Error com mensagem amigável em caso de parâmetros inválidos.
 */
export async function listItemMovements(
  itemId: number,
  enterpriseId: number,
  filters?: {
    safe_delete?: boolean;
    type?: "entrada" | "saida";
  }
) {
  if (!itemId || !enterpriseId) {
    throw new Error("Parâmetros 'itemId' e 'enterpriseId' são obrigatórios.");
  }
  if (Number.isNaN(itemId) || Number.isNaN(enterpriseId)) {
    throw new Error("Parâmetros inválidos: 'itemId' e 'enterpriseId' devem ser números.");
  }

  const data = await fetchMovementsByItem(itemId, enterpriseId, filters);

  if (!Array.isArray(data)) {
    throw new Error("Erro ao consultar movimentações do item.");
  }

  return data.map((m: any) => ({
    ...m,
    data_movimentacao: new Date(m.date).toLocaleDateString("pt-BR"),
  }));
}