import { supabase } from "@/utils/supabase/supabaseClient";

export async function insertMovement(movements: any[]) {
  const { data, error } = await supabase
    .from("movement_history")
    .insert(movements)
    .select();

  if (error) throw new Error(`Erro ao registrar movimentação: ${error.message}`);

  return data;
}