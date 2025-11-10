import { selectItemByIdDB } from "@/lib/data-base/item/select-item-by-id";
import { Item } from "../../models/item_model";

/**
 * Busca um item por ID com regras de negócio.
 * Retorna o item com os nomes de segment, group e unit (não os IDs).
 */
export async function getItemById(id: number): Promise<Item | null> {
  try {
    const item = await selectItemByIdDB(id);
    
    if (!item) {
      return null;
    }

    // Regras de negócio podem ser aplicadas aqui
    // Exemplo: validar se o item pertence à empresa do usuário logado
    // Exemplo: verificar permissões de acesso
    // Exemplo: filtrar campos sensíveis

    return item;
  } catch (error) {
    throw new Error(`Erro ao buscar item -> ${error}`);
  }
}