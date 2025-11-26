import { supabase } from "@/utils/supabase/supabaseClient";
import { Item } from "@/lib/models/item_model";

export async function fetchItemById(id: number): Promise<Item | null> {
  const { data, error } = await supabase
    .from("item")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Erro ao buscar item pelo ID: ${error.message}`);
  }

  return data as Item | null;
}