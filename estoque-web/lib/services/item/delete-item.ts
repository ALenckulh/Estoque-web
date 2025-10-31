import { supabase } from "@/utils/supabase/supabaseClient";
import { Item } from "../../models/item_model";

export async function deleteItem(id: number): Promise<Item> {
  const { data, error } = await supabase
    .from("items")
    .update({ safe_delete: true })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao realizar soft delete do item: ${error.message}`);
  }

  return data as Item;
}
