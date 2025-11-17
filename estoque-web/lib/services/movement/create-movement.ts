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
  user_id: number | string;
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

      if (!item || item.enterprise_id !== enterprise_id || item.safe_delete === true) {
        throw new Error(`Item inválido ou inativo: ID ${item_id}`);
      }

      // Validações solicitadas:
      // - Se for 'entrada', não permitir quantidade negativa
      // - Se for 'saida', não permitir quantidade positiva (usuário deve enviar valor negativo)
      if (type === "entrada" && quantity < 0) {
        throw new Error(
          `Quantidade inválida para entrada do item ${item_id}: não pode ser negativa.`
        );
      }

      if (type === "saida" && quantity > 0) {
        throw new Error(
          `Quantidade inválida para saída do item ${item_id}: informe um valor negativo.`
        );
      }

      // Determinar a quantidade efetiva a aplicar (usar valor absoluto para operações)
      const effectiveQuantity = Math.abs(quantity);

      let newQuantity = item.quantity;

      if (type === "entrada") {
        newQuantity += effectiveQuantity;
      } else if (type === "saida") {
        if (item.quantity < effectiveQuantity) {
          throw new Error(`Estoque insuficiente para o item ${item.name}`);
        }
        newQuantity -= effectiveQuantity;
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