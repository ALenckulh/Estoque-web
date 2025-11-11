import { supabase } from "@/utils/supabase/supabaseClient";
import { Item } from "../../models/item_model";

// Buscar item por ID
export async function fetchItemById(id: number): Promise<Item | null> {
  const { data, error } = await supabase
<<<<<<< HEAD
    .from("item")
=======
    .from("items")
>>>>>>> 5623cfa (Implementa Item CRUD: model, database, services e routes além de alguns ajustes pontuais e adição do listUser)
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