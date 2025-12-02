import { supabase } from "@/utils/supabase/supabaseClient";
import { Item } from "../../models/item_model";

export async function insertItemDB(item: Item): Promise<Item> {
  const { data, error } = await supabase
    .from('item')
    .insert(item)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao inserir item: ${error.message}`);
  }

  // Atualiza o objeto com o id retornado
  item.id = data?.id ?? item.id;
  console.log(`Item ${item.name} inserido com sucesso! id=${item.id}`);
  return item;
}