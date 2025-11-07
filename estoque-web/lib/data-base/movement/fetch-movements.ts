import { supabase } from "@/utils/supabase/supabaseClient";

interface Params {
  group_id?: string | null;
  user_id?: string | null;
  enterprise_id?: string | null;
  from: number;
  to: number;
}

export async function fetchMovements({ group_id, user_id, enterprise_id, from, to }: Params) {
  let query = supabase
    .from("movement_history")
    .select(`
      group_id,
      nota_fiscal,
      date,
      user_id,
      enterprise_id,
      item_id,
      quantity
    `)
    .order("date", { ascending: false })
    .range(from, to);

  if (group_id) query = query.eq("group_id", group_id);
  if (user_id) query = query.eq("user_id", user_id);
  if (enterprise_id) query = query.eq("enterprise_id", enterprise_id);

  const { data, error } = await query;
  if (error) throw new Error(`Erro ao buscar movimentações: ${error.message}`);

  return data;
}