import { supabase } from "@/utils/supabase/supabaseClient";

export async function updateItemStock(item_id: number, quantity: number) {
  const { error } = await supabase
    .from("item")
    .update({ quantity })
    .eq("id", item_id);

  if (error) throw new Error(`Erro ao atualizar estoque do item: ${error.message}`);
}