import { supabase } from "@/utils/supabase/supabaseClient";
import { Item } from "../../models/item_model";

/**
 * Lista todos os itens de um enterprise com joins para obter os nomes de segment, group e unit.
 * Retorna os nomes ao invés dos IDs para facilitar exibição.
 */
export async function listItemsDB(
  enterprise_id: number,
  filters?: {
    group_id?: number;
    created_at?: string;
    unit_id?: number;
    safe_delete?: boolean;
    quantity?: "negativo" | "baixo" | "normal";
  }
): Promise<Item[]> {
  let query = supabase
    .from("item")
    .select(`
      *,
      segment:segment_id(name),
      group_table:group_id(name),
      unit:unit(name)
    `)
    .eq("enterprise_id", enterprise_id);

  if (filters) {
    if (filters.group_id) query = query.eq("group_id", filters.group_id);
    if (filters.created_at) query = query.eq("created_at", filters.created_at);
    if (filters.unit_id) query = query.eq("unit_id", filters.unit_id);
    if (typeof filters.safe_delete === "boolean") query = query.eq("safe_delete", filters.safe_delete);
    // Quantidade: filtra por string
    if (filters.quantity === "negativo") {
      query = query.lt("quantity", 0);
    } else if (filters.quantity === "baixo") {
      query = query.gte("quantity", 0).lt("quantity", "quantity_alert");
    } else if (filters.quantity === "normal") {
      query = query.gte("quantity", "quantity_alert");
    }
  }

  const { data, error } = await query;

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