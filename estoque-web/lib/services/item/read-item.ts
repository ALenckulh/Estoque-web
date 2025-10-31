import { fetchItemById } from "@/lib/data-base/item/select-item-by-id";
import { Item } from "../../models/item_model";

export async function getItemById(id: number): Promise<Item | null> {
  try {
    return await fetchItemById(id);
  } catch (error) {
    throw new Error(`Erro ao buscar item -> ${error}`);
  }
}