import { supabase } from "@/utils/supabase/supabaseClient";

interface ListMovementsParams {
  groupId?: string | null;
  userId?: string | null;
  enterpriseId?: string | null;
  page?: number;
  pageSize?: number;
}

export async function listMovements({
  groupId,
  userId,
  enterpriseId,
  page = 1,
  pageSize = 20,
}: ListMovementsParams) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("movement_history")
    .select(
      `
      group_id,
      nota_fiscal,
      date,
      user_id,
      enterprise_id,
      item_id,
      quantity
    `
    )
    .order("date", { ascending: false })
    .range(from, to);

  if (groupId) query = query.eq("group_id", groupId);
  if (userId) query = query.eq("user_id", userId);
  if (enterpriseId) query = query.eq("enterprise_id", enterpriseId);

  const { data, error } = await query;

  if (error) throw new Error(`Erro ao buscar movimentações: ${error.message}`);

  return data.map((m) => ({
    ...m,
    data_movimentacao: new Date(m.date).toLocaleDateString("pt-BR"),
  }));
}