<<<<<<< HEAD
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
=======
import { deleteItemDB } from "@/lib/data-base/item/delete-item";
import { Item } from "../../models/item_model";

export async function deleteItem(id: number): Promise<Item> {
  try {
    const deletedItem = await deleteItemDB(id);
    return deletedItem;
  } catch (error) {
    throw new Error(`Erro ao deletar item -> ${error}`);
  }
}
>>>>>>> 5623cfa (Implementa Item CRUD: model, database, services e routes além de alguns ajustes pontuais e adição do listUser)
