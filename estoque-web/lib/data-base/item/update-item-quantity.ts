import { supabase } from "@/utils/supabase/supabaseClient";

/**
 * Atualiza a quantidade de um item.
 */
export async function updateItemQuantity(itemId: number, quantity: number) {
  const { error } = await supabase
    .from("item")
    .update({ quantity })
    .eq("id", itemId);

  if (error) {
    throw new Error(`Erro ao atualizar quantidade do item ${itemId}: ${error.message}`);
  }
}

