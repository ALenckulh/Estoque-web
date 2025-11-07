import { insertMovement } from "@/lib/data-base/movement/insert-movement";
import { updateItemStock } from "@/lib/data-base/movement/update-item-stock";
import { fetchLastGroupId } from "@/lib/data-base/movement/fetch-last-group-id";
import { fetchItemById } from "@/lib/data-base/item/fetch-item-by-id";

interface MovementBody {
  type: "entrada" | "saida";
  lote?: string;
  nota_fiscal?: string;
  date: string;
  user_id: number;
  participate_id?: number;
  enterprise_id: number;
  items: { item_id: number; quantity: number }[];
}

export async function createMovement(body: MovementBody) {
  const {
    type,
    lote,
    nota_fiscal,
    date,
    user_id,
    participate_id,
    enterprise_id,
    items,
  } = body;

  const lastGroupId = await fetchLastGroupId();
  const newGroupId = lastGroupId ? lastGroupId + 1 : 1;

  const movementsToInsert: any[] = [];

  for (const { item_id, quantity } of items) {
    const item = await fetchItemById(item_id);

    if (!item || item.enterprise_id !== enterprise_id || item.safe_delete) {
      throw new Error(`Item ${item_id} não encontrado ou inativo.`);
    }

    let newQuantity = item.quantity;

    if (type === "entrada") newQuantity += quantity;
    else if (type === "saida") {
      if (item.quantity < quantity)
        throw new Error(`Estoque insuficiente para o item ${item.name}.`);
      newQuantity -= quantity;
    } else {
      throw new Error("Tipo de movimentação inválido.");
    }

    await updateItemStock(item_id, newQuantity);

    movementsToInsert.push({
      group_id: newGroupId,
      lote,
      nota_fiscal,
      date,
      quantity,
      user_id,
      item_id,
      participate_id,
      safe_delete: false,
      created_at: new Date().toISOString(),
      enterprise_id,
    });
  }

  const movements = await insertMovement(movementsToInsert);

  return {
    message: "Movimentação registrada com sucesso.",
    group_id: newGroupId,
    movements,
  };
}