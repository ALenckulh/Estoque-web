import { supabase } from "@/utils/supabase/supabaseClient";
import { Item } from "../../models/item_model";

export async function insertItem(item: Item) {
  const { error } = await supabase
<<<<<<< HEAD
    .from('item')
=======
    .from('items')
>>>>>>> 5623cfa (Implementa Item CRUD: model, database, services e routes além de alguns ajustes pontuais e adição do listUser)
    .insert(item);

  if (error) {
    throw new Error(`Erro ao inserir item: ${error.message}`);
  }

  console.log(`Item ${item.name} inserido com sucesso!`);
}