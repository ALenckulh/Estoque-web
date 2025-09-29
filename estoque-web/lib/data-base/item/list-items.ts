import { supabase } from "@/utils/supabase/supabaseClient";
import { Item } from "../../models/item_model";

export async function fetchAllItems(): Promise<Item[]> {
  const { data, error } = await supabase
    .from("items")
    .select("*");

  if (error) {
    throw new Error(`Erro ao buscar itens: ${error.message}`);
  }

  return data as Item[];
}