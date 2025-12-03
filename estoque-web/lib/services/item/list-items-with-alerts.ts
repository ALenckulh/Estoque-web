import { listItems } from "./list-items";
import { Item } from "../../models/item_model";

/**
 * Retorna apenas os totais de itens negativos e em alerta para um enterprise.
 */
export async function listItemsWithAlerts(enterprise_id: number): Promise<{
  totalNegativo: number,
  totalAlerta: number
}> {
  try {
    // chama a função existente para manter registros e regras atuais
    const items: Item[] = await listItems(enterprise_id);

    // total de itens com quantity < 0
    const totalNegativo = items.filter(item => item.quantity < 0).length;

    // total de itens em alerta (quantity < quantity_alert e >= 0)
    const totalAlerta = items.filter(
  item => item.quantity_alert !== undefined && item.quantity <= item.quantity_alert && item.quantity >= 0).length;

    return { totalNegativo, totalAlerta };
  } catch (error: any) {
    throw new Error(`Erro ao calcular totais de itens -> ${error.message || error}`);
  }
}
