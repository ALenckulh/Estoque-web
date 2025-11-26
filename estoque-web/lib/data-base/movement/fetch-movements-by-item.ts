import { supabase } from "@/utils/supabase/supabaseClient";

/**
 * Busca todas as movimentações de um item específico em uma empresa.
 * Retorna ordenado por data (mais recente primeiro).
 */
export async function fetchMovementsByItem(itemId: number, enterpriseId: number) {
  const { data, error } = await supabase
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
    .eq("enterprise_id", enterpriseId)
    .order("date", { ascending: false });

  if (error) {
    throw new Error("Erro ao buscar movimentações do item: " + error.message);
  }

  return data ?? [];
}
