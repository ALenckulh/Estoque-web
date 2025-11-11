import { supabase } from "@/utils/supabase/supabaseClient";
import { Item } from "../../models/item_model";

export async function deleteItemDB(id: number): Promise<Item> {
  const { data, error } = await supabase
<<<<<<< HEAD
    .from("item")
    .update({ safe_delete: true })
    .eq("id", id)
=======
    .from('items')
    .delete()
    .eq('id', id)
>>>>>>> 5623cfa (Implementa Item CRUD: model, database, services e routes além de alguns ajustes pontuais e adição do listUser)
    .select()
    .single();

  if (error) {
<<<<<<< HEAD
    throw new Error(`Erro ao realizar soft delete do item: ${error.message}`);
=======
    throw new Error(`Erro ao deletar item: ${error.message}`);
>>>>>>> 5623cfa (Implementa Item CRUD: model, database, services e routes além de alguns ajustes pontuais e adição do listUser)
  }

  return data as Item;
}
