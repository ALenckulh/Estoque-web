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