import { listItemsDB } from "@/lib/data-base/item/list-items";
import { Item } from "../../models/item_model";

/**
 * Lista todos os itens de um enterprise com regras de negócio.
 * Retorna os itens com os nomes de segment, group e unit (não os IDs).
 */
export async function listItems(enterprise_id: number): Promise<Item[]> {
  try {
    const items = await listItemsDB(enterprise_id);
    
    // Regras de negócio podem ser aplicadas aqui
    // Exemplo: filtrar itens deletados se safe_delete = true
    // Exemplo: ordenar por algum critério específico
    // Exemplo: aplicar transformações adicionais

    return items;
  } catch (error) {
    throw new Error(`Erro ao listar itens -> ${error}`);
  }
}