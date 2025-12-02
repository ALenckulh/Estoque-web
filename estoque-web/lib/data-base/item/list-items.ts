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
    if (filters.created_at) {
      // Filtra por data ignorando o horário
      const startOfDay = `${filters.created_at}T00:00:00.000Z`;
      const endOfDay = `${filters.created_at}T23:59:59.999Z`;
      query = query.gte("created_at", startOfDay).lte("created_at", endOfDay);
    }
    if (filters.unit_id) query = query.eq("unit_id", filters.unit_id);
    if (typeof filters.safe_delete === "boolean") query = query.eq("safe_delete", filters.safe_delete);
    if (filters.quantity === "negativo") {
      query = query.lt("quantity", 0);
    } else if (filters.quantity === "baixo" || filters.quantity === "normal") {
      query = query.gte("quantity", 0);
    }
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Erro ao buscar itens: ${error.message}`);
  }

  if (!data) return [];

  // Filtra manualmente para baixo/normal
  let filtered = data;
  if (filters?.quantity === "baixo") {
    filtered = filtered.filter((item) => {
      const qty = Number(item.quantity);
      const alert = Number(item.quantity_alert);
      const isValid = !isNaN(qty) && !isNaN(alert) && qty >= 0 && qty < alert;
      return isValid;
    });
  } else if (filters?.quantity === "normal") {
    filtered = filtered.filter((item) => {
      const qty = Number(item.quantity);
      const alert = Number(item.quantity_alert);
      const isValid = !isNaN(qty) && !isNaN(alert) && qty >= alert;
      return isValid;
    });
  }

  // Mapeia os dados para incluir os nomes dos relacionamentos
  return filtered.map((item) => ({
    ...item,
    segment_name: item.segment?.name,
    group_name: item.group_table?.name,
    unit_name: item.unit?.name,
  })) as Item[];
}