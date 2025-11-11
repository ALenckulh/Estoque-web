import { supabase } from "@/utils/supabase/supabaseClient";
import { Item } from "../../models/item_model";

interface UpdateParameters {
  name?: string;
  description?: string;
  quantity?: number;
  quantity_alert?: number;
  unity?: string;
  segment_id?: number;
  manufacturer?: string;
  position?: string;
  group_id?: number;
<<<<<<< HEAD
}

export async function updateItemDB(id: number, updates: UpdateParameters): Promise<Item> {
  // Garantia extra: se por algum motivo vier enterprise_id no objeto, remove
  const { enterprise_id, ...safeUpdates } = updates as any;

  const { data, error } = await supabase
    .from("item")
    .update(safeUpdates)
    .eq("id", id)
=======
  enterprise_id?: number;
}

export async function updateItemDB(id: number, updates: UpdateParameters): Promise<Item> {
  const { data, error } = await supabase
    .from('items')
    .update(updates)
    .eq('id', id)
>>>>>>> 5623cfa (Implementa Item CRUD: model, database, services e routes além de alguns ajustes pontuais e adição do listUser)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao atualizar item: ${error.message}`);
  }

  return data as Item;
<<<<<<< HEAD
}
=======
}
>>>>>>> 5623cfa (Implementa Item CRUD: model, database, services e routes além de alguns ajustes pontuais e adição do listUser)
