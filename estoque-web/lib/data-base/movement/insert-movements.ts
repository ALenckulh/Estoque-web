import { supabase } from "@/utils/supabase/supabaseClient";

interface MovementHistoryInsert {
  group_id: number;
  lote?: string;
  nota_fiscal?: string;
  date: string;
  quantity: number;
  user_id: number | string;
  item_id: number;
  participate_id?: number;
  safe_delete: boolean;
  created_at: string;
  enterprise_id: number;
}

/**
 * Insere múltiplas movimentações no histórico.
 * Retorna os registros inseridos com seus IDs.
 */
export async function insertMovements(movements: MovementHistoryInsert[]) {
  const { data, error } = await supabase
    .from("movement_history")
    .insert(movements)
    .select();

  if (error) throw error;

  return data;
}
