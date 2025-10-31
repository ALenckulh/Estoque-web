import { supabase } from "@/utils/supabase/supabaseClient";
import { Item } from "../../models/item_model";

export async function insertItem(item: Item) {
  const { error } = await supabase
    .from('items')
    .insert(item);

  if (error) {
    throw new Error(`Erro ao inserir item: ${error.message}`);
  }

  console.log(`Item ${item.name} inserido com sucesso!`);
}