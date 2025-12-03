import { supabase } from "@/utils/supabase/supabaseClient";

/**
 * Busca todas as movimentações de uma entidade específica em uma empresa.
 * Retorna ordenado por data (mais recente primeiro).
 */
export async function listEntityMovementsDB(participate_id: number, enterprise_id: number) {
  try {
    const { data, error } = await supabase
      .from("movement_history")
      .select(`
        id,
        group_id,
        nota_fiscal,
        user_id,
        date,
        participate_id,
        quantity,
        safe_delete
      `)
      .eq("participate_id", participate_id)
      .eq("enterprise_id", enterprise_id);

    if (error) {
      console.error("Erro ao buscar movimentações da entidade:", error);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error("Erro inesperado ao buscar movimentações da entidade:", err);
    return [];
  }
}
