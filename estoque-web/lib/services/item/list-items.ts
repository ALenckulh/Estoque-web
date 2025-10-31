import { fetchAllItems } from "@/lib/data-base/item/list-items";
import { Item } from "../../models/item_model";

export async function listItems(): Promise<Item[]> {
  try {
    return await fetchAllItems();
  } catch (error) {
    throw new Error(`Erro ao listar itens -> ${error}`);
  }
}