import { supabase } from "@/utils/supabase/supabaseClient";

/**
 * Busca todas as movimentações de um group_id específico.
 * Usado para operações de toggle safe-delete.
 */
export async function fetchMovementsByGroupId(groupId: number, enterpriseId: number) {
  const { data, error } = await supabase
    .from("movement_history")
    .select(`
      id,
      group_id,
      item_id,
      quantity,
      safe_delete,
      enterprise_id
    `)
    .eq("group_id", groupId)
    .eq("enterprise_id", enterpriseId);

  if (error) {
    throw new Error(`Erro ao buscar movimentações do grupo: ${error.message}`);
  }

  return data ?? [];
}
