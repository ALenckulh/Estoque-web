import { supabase } from "@/utils/supabase/supabaseClient";
import { Item } from "../../models/item_model";

export async function updateSafeDeleteItemDB(id: number): Promise<Item> {
  const { data: currentData, error: fetchError } = await supabase
    .from("item")
    .select("safe_delete")
    .eq("id", id)
    .single();

  if (fetchError) throw new Error(`Erro ao buscar item -> ${fetchError.message}`);

  const newSafeDelete = !currentData.safe_delete;

  const { data, error } = await supabase
    .from("item")
    .update({ safe_delete: newSafeDelete })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao realizar soft delete do item: ${error.message}`);
  }

  return data as Item;
}
