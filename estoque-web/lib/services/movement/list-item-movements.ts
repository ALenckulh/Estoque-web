import { supabase } from "@/utils/supabase/supabaseClient";

export async function listItemMovements(itemId: number, enterpriseId: number) {
  const { data, error } = await supabase
    .from("movement_history")
    .select(`
      id,
      group_id,
      nota_fiscal,
      date,
      user_id,
      item_id,
      quantity,
      safe_delete
    `)
    .eq("item_id", itemId)
    .eq("enterprise_id", enterpriseId)
    .order("date", { ascending: false });

  if (error) {
    throw new Error("Erro ao buscar movimentações do item: " + error.message);
  }

  return data?.map((m) => ({
    ...m,
    data_movimentacao: new Date(m.date).toLocaleDateString("pt-BR"),
  })) ?? [];
}
