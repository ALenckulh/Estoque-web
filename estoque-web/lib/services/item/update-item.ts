import { Item } from "../../models/item_model";
import { updateItemDB } from "@/lib/data-base/item/update-item";

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
=======
  enterprise_id?: number;
>>>>>>> 5623cfa (Implementa Item CRUD: model, database, services e routes além de alguns ajustes pontuais e adição do listUser)
}

export async function updateItem(id: number, updates: UpdateParameters): Promise<Item> {
  try {
<<<<<<< HEAD

=======
>>>>>>> 5623cfa (Implementa Item CRUD: model, database, services e routes além de alguns ajustes pontuais e adição do listUser)
    const updatedItem = await updateItemDB(id, updates);
    return updatedItem;
  } catch (error) {
    throw new Error(`Erro ao atualizar item -> ${error}`);
  }
}
