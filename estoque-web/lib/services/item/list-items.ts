import { listItemsDB } from "@/lib/data-base/item/list-items";
import { Item } from "../../models/item_model";

/**
 * Lista todos os itens de um enterprise com regras de negócio.
 * Retorna os itens com os nomes de segment, group e unit (não os IDs).
 */
export async function listItems(enterprise_id: number, filters?: any): Promise<Item[]> {
  try {
    const items = await listItemsDB(enterprise_id, filters);
    return items;
  } catch (error) {
    throw new Error(`Erro ao listar itens -> ${error}`);
  }
}