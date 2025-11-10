import { supabase } from "@/utils/supabase/supabaseClient";
import { Item } from "../../models/item_model";

/**
 * Lista todos os itens de um enterprise com joins para obter os nomes de segment, group e unit.
 * Retorna os nomes ao invés dos IDs para facilitar exibição.
 */
export async function listItemsDB(
  enterprise_id: number
): Promise<Item[]> {
  const { data, error } = await supabase
    .from("item")
    .select(`
      *,
      segment:segment_id(name),
      group_table:group_id(name),
      unit:unit(name)
    `)
    .eq("enterprise_id", enterprise_id);

  if (error) {
    throw new Error(`Erro ao buscar itens: ${error.message}`);
  }

  if (!data) return [];

  // Mapeia os dados para incluir os nomes dos relacionamentos
  return data.map((item) => ({
    ...item,
    segment_name: item.segment?.name,
    group_name: item.group_table?.name,
    unit_name: item.unit?.name,
  })) as Item[];
}