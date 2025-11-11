import { supabase } from "@/utils/supabase/supabaseClient";
import { Item } from "../../models/item_model";

export async function fetchAllItems(): Promise<Item[]> {
  const { data, error } = await supabase
<<<<<<< HEAD
    .from("item")
=======
    .from("items")
>>>>>>> 5623cfa (Implementa Item CRUD: model, database, services e routes além de alguns ajustes pontuais e adição do listUser)
    .select("*");

  if (error) {
    throw new Error(`Erro ao buscar itens: ${error.message}`);
  }

  return data as Item[];
}