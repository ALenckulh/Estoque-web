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
  enterprise_id?: number; // ← veio do commit CRUD
}

export async function updateItem(id: number, updates: UpdateParameters): Promise<Item> {
  try {
    // Ignorar enterprise_id por segurança, não deve ser atualizado aqui
    const { enterprise_id, ...safeUpdates } = updates;

    const updatedItem = await updateItemDB(id, safeUpdates);
    return updatedItem;
  } catch (error) {
    throw new Error(`Erro ao atualizar item -> ${error}`);
  }
}