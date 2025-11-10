import { supabase } from "@/utils/supabase/supabaseClient";
import { Item } from "../../models/item_model";

/**
 * Busca um item por ID com joins para obter os nomes de segment, group e unit.
 * Retorna os nomes ao invés dos IDs para facilitar exibição.
 */
export async function selectItemByIdDB(id: number): Promise<Item | null> {
  const { data, error } = await supabase
    .from("item")
    .select(`
      *,
      segment:segment_id(name),
      group_table:group_id(name),
      unit:unit(name)
    `)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Erro ao buscar item: ${error.message}`);
  }

  if (!data) return null;

  // Extrai os nomes dos relacionamentos
  const segment_name = data.segment?.name;
  const group_name = data.group_table?.name;
  const unit_name = data.unit?.name;

  return {
    ...data,
    segment_name,
    group_name,
    unit_name,
  } as Item;
}