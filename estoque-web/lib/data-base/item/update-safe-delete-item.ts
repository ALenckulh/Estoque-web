import { supabase } from "@/utils/supabase/supabaseClient";
import { Item } from "../../models/item_model";

export async function updateSafeDeleteItemDB(id: number, safe_delete: boolean): Promise<Item> {
  const { data, error } = await supabase
    .from("item")
    .update({ safe_delete })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao atualizar safe_delete do item: ${error.message}`);
  }

  return data as Item;
}
