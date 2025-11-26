import { fetchMovementsByEnterprise } from "@/lib/data-base/movement/fetch-movements-by-enterprise";

interface ListMovementsParams {
  enterpriseId?: string | null;
}

export async function listMovements({
  enterpriseId,
}: ListMovementsParams) {

  // Validação 1: enterprise_id é obrigatório
  if (!enterpriseId) {
    throw new Error("Parâmetro 'enterprise_id' é obrigatório.");
  }

  // Converter para número e validar
  const entId = Number(enterpriseId);
  if (Number.isNaN(entId) || entId <= 0) {
    throw new Error("Parâmetro 'enterprise_id' deve ser um número válido e maior que zero.");
  }

  const data = await fetchMovementsByEnterprise(entId);

  return data.map((m) => ({
    ...m,
    data_movimentacao: new Date(m.date).toLocaleDateString("pt-BR"),
  }));
}