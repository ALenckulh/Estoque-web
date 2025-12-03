import { supabase } from "@/utils/supabase/supabaseClient";

/**
 * Busca todas as movimentações de uma entidade específica em uma empresa.
 * Retorna ordenado por data (mais recente primeiro).
 */
export async function listEntityMovementsDB(
  participate_id: number,
  enterprise_id: number,
  filters?: {
    safe_delete?: boolean;
    type?: "entrada" | "saida";
  }
) {
  try {
    let query = supabase
      .from("movement_history")
      .select(`
        id,
        item_id,
        item:item_id(name),
        group_id,
        nota_fiscal,
        user_id,
        date,
        participate_id,
        quantity,
        safe_delete
      `)
      .eq("participate_id", participate_id)
      .eq("enterprise_id", enterprise_id);

    // Apply filters at DB level
    if (filters) {
      if (typeof filters.safe_delete === "boolean") {
        query = query.eq("safe_delete", filters.safe_delete);
      }
      if (filters.type === "entrada") {
        query = query.gt("quantity", 0);
      } else if (filters.type === "saida") {
        query = query.lt("quantity", 0);
      }
    }

    query = query.order("date", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar movimentações da entidade:", error);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error("Erro inesperado ao buscar movimentações da entidade:", err);
    return [];
  }
}
