import { supabase } from "@/utils/supabase/supabaseClient";

/**
 * Busca todas as movimentações de um item específico em uma empresa.
 * Retorna ordenado por data (mais recente primeiro).
 */
export async function fetchMovementsByItem(
  itemId: number,
  enterpriseId: number,
  filters?: {
    safe_delete?: boolean;
    type?: "entrada" | "saida";
  }
) {
  let query = supabase
    .from("movement_history")
    .select(`
      id,
      group_id,
      nota_fiscal,
      date,
      user_id,
      item_id,
      quantity,
      safe_delete,
    `)
    .eq("item_id", itemId)
    .eq("enterprise_id", enterpriseId);

  // Apply filters at DB level
  if (filters) {
    if (typeof filters.safe_delete === "boolean") {
      query = query.eq("safe_delete", filters.safe_delete);
    }
    if (filters.type === "entrada") {
      query = query.gt("quantity", 0);
    } else if (filters.type === "saida") {
      query = query.lt("quantity", 0);
    }
  }

  query = query.order("date", { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error("Erro ao buscar movimentações do item: " + error.message);
  }

  return data ?? [];
}
