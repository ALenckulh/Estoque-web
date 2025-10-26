import { supabase } from "@/utils/supabase/supabaseClient";
import { Item } from "../../models/item_model";

// Buscar item por ID
export async function fetchItemById(id: number): Promise<Item | null> {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    // PGRST116 = nenhuma linha encontrada
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Erro ao buscar item: ${error.message}`);
  }

  return data as Item;
}