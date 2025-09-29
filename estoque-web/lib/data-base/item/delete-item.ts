import { supabase } from "@/utils/supabase/supabaseClient";
import { Item } from "../../models/item_model";

export async function deleteItemDB(id: number): Promise<Item> {
  const { data, error } = await supabase
    .from('items')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao deletar item: ${error.message}`);
  }

  return data as Item;
}
