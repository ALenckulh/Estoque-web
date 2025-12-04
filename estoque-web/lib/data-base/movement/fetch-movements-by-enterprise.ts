import { supabase } from "@/utils/supabase/supabaseClient";

/**
 * Busca todas as movimentações de uma empresa específica.
 * Retorna ordenado por group_id (mais recente primeiro).
 */
export async function fetchMovementsByEnterprise(
  enterpriseId: number,
  filters?: {
    safe_delete?: boolean;
    type?: "entrada" | "saida";
  }
) {
  let query = supabase
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

  query = query.order("group_id", { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Erro ao buscar movimentações: ${error.message}`);
  }

  return data ?? [];
}
