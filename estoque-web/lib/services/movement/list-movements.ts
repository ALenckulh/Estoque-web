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

  // Validação 1: enterprise_id é obrigatório
  if (!enterpriseId) {
    throw new Error("Parâmetro 'enterprise_id' é obrigatório.");
  }

  // Converter para número e validar
  const entId = Number(enterpriseId);
  if (Number.isNaN(entId) || entId <= 0) {
    throw new Error("Parâmetro 'enterprise_id' deve ser um número válido e maior que zero.");
  }

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
      quantity,
      safe_delete
    `
    )
    .order("group_id", { ascending: false })
    .range(from, to)
    .eq("enterprise_id", entId);

  const { data, error } = await query;

  if (error) throw new Error(`Erro ao buscar movimentações: ${error.message}`);

  return data.map((m) => ({
    ...m,
    data_movimentacao: new Date(m.date).toLocaleDateString("pt-BR"),
  }));
}