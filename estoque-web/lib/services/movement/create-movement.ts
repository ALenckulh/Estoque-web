import { supabase } from "@/utils/supabase/supabaseClient";
import { fetchItemById } from "@/lib/data-base/item/fetch-item-by-id";

interface MovementItem {
  item_id: number;
  quantity: number;
}

interface CreateMovementParams {
  type: "entrada" | "saida";
  lote?: string;
  nota_fiscal?: string;
  date: string;
  user_id: number;
  participate_id?: number;
  enterprise_id: number;
  items: MovementItem[];
}

export async function createMovement({
  type,
  lote,
  nota_fiscal,
  date,
  user_id,
  participate_id,
  enterprise_id,
  items,
}: CreateMovementParams) {
  try {
    // Buscar o último group_id
    const { data: lastMovement } = await supabase
      .from("movement_history")
      .select("group_id")
      .order("group_id", { ascending: false })
      .limit(1)
      .single();

    const newGroupId = lastMovement ? lastMovement.group_id + 1 : 1;

    const movementsToInsert: any[] = [];

    for (const { item_id, quantity } of items) {
      const item = await fetchItemById(item_id);

      if (!item || item.enterprise_id !== enterprise_id || item.safe_delete) {
        throw new Error(`Item inválido ou inativo: ID ${item_id}`);
      }

      let newQuantity = item.quantity;

      if (type === "entrada") {
        newQuantity += quantity;
      } else if (type === "saida") {
        if (item.quantity < quantity) {
          throw new Error(`Estoque insuficiente para o item ${item.name}`);
        }
        newQuantity -= quantity;
      }

      const { error: updateError } = await supabase
        .from("item")
        .update({ quantity: newQuantity })
        .eq("id", item_id);

      if (updateError) throw updateError;

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

    const { data: movements, error: movementError } = await supabase
      .from("movement_history")
      .insert(movementsToInsert)
      .select();

    if (movementError) throw movementError;

    return {
      message: "Movimentação registrada com sucesso.",
      group_id: newGroupId,
      movements,
    };
  } catch (error: any) {
    throw new Error(`Erro ao criar movimentação: ${error.message}`);
  }
}