import { supabase } from "@/utils/supabase/supabaseClient";

/**
 * Atualiza o safe_delete de todas as movimentacoes de um group_id.
 */
export async function updateSafeDeleteByGroup(groupId: number, safeDelete: boolean) {
  const { error } = await supabase
    .from("movement_history")
    .update({ safe_delete: safeDelete })
    .eq("group_id", groupId);

  if (error) {
    throw new Error(`Erro ao atualizar safe_delete: ${error.message}`);
  }
}

