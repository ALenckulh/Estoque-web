import { supabase } from "@/utils/supabase/supabaseClient";

/**
 * Exclui todas as movimentações de um group_id específico.
 * Usado principalmente para rollback de operações.
 */
export async function deleteMovementsByGroup(groupId: number): Promise<void> {
  const { error } = await supabase
    .from("movement_history")
    .delete()
    .eq("group_id", groupId);

  if (error) throw error;
}
