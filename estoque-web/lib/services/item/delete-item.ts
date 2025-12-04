import { Item } from "../../models/item_model";
import { updateSafeDeleteItemDB } from "@/lib/data-base/item/update-safe-delete-item";

export async function deleteItem(id: number): Promise<Item> {
  try {
      const deletedItem = await updateSafeDeleteItemDB(id, true);
  
      return deletedItem;
    } catch (error) {
      throw new Error(`Erro ao deletar item -> ${error}`);
    }

}
