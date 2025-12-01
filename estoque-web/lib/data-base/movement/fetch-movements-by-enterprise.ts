import { supabase } from "@/utils/supabase/supabaseClient";

/**
 * Busca todas as movimentações de uma empresa específica.
 * Retorna ordenado por group_id (mais recente primeiro).
 */
export async function fetchMovementsByEnterprise(enterpriseId: number) {
  const { data, error } = await supabase
    .from("movement_history")
    .select(
      `
      id,
      group_id,
      nota_fiscal,
      date,
      user_id,
      enterprise_id,
      item_id,
      quantity,
      safe_delete
    `
    )
    .eq("enterprise_id", enterpriseId)
    .order("group_id", { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar movimentações: ${error.message}`);
  }

  return data ?? [];
}
