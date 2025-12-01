import { fetchItemById } from "@/lib/data-base/item/fetch-item-by-id";
import { updateItemQuantity } from "@/lib/data-base/item/update-item-quantity";
import { fetchMovementsByGroupId } from "@/lib/data-base/movement/fetch-movements-by-group";
import { updateSafeDeleteByGroup } from "@/lib/data-base/movement/update-safe-delete-by-group";
import { supabase } from "@/utils/supabase/supabaseClient";

interface ToggleMovementSafeDeleteParams {
  group_id?: number;
  movement_id?: number;
  enterprise_id: number;
}

export async function toggleMovementSafeDelete({
  group_id,
  movement_id,
  enterprise_id,
}: ToggleMovementSafeDeleteParams) {
  const updatedItems: Array<{ id: number; oldQuantity: number }> = [];
  let newSafeDeleteValue: boolean | null = null;

  try {
    // 1. Obter movimentações alvo (grupo inteiro ou uma linha)
    let movements: Array<{
      id: number;
      group_id: number;
      quantity: number;
      item_id: number;
      safe_delete: boolean;
      enterprise_id: number;
    }> = [];

    if (typeof movement_id === "number" && movement_id > 0) {
      const { data, error } = await supabase
        .from("movement_history")
        .select("id, group_id, quantity, item_id, safe_delete, enterprise_id")
        .eq("id", movement_id)
        .eq("enterprise_id", enterprise_id)
        .limit(1);
      if (error) throw new Error(`Falha ao buscar movimentação: ${error.message}`);
      if (!data || data.length === 0) {
        throw new Error(`Movimentação ${movement_id} não encontrada`);
      }
      movements = [data[0] as any];
    } else if (typeof group_id === "number" && group_id > 0) {
      movements = await fetchMovementsByGroupId(group_id, enterprise_id);
      if (!movements || movements.length === 0) {
        throw new Error(`Nenhuma movimentação encontrada para o grupo ${group_id}`);
      }
    } else {
      throw new Error("Informe 'movement_id' para linha única ou 'group_id' para grupo inteiro.");
    }

    // 2. Determinar o novo valor de safe_delete (toggle do primeiro registro)
    const currentSafeDelete = movements[0].safe_delete;
    newSafeDeleteValue = !currentSafeDelete;

    console.log(`[TOGGLE] Alterando safe_delete de ${currentSafeDelete} para ${newSafeDeleteValue}`);

    // 3. Reverter ou reaplicar as quantidades nos itens
    for (const movement of movements) {
      const item = await fetchItemById(movement.item_id);

      if (!item || item.enterprise_id !== enterprise_id) {
        throw new Error(`Item inválido: ID ${movement.item_id}`);
      }

      // Salvar quantidade antiga para rollback
      updatedItems.push({ id: item.id!, oldQuantity: item.quantity! });

      const currentQuantity = item.quantity!;
      const movementQty = movement.quantity;
      let newQuantity: number;

      if (newSafeDeleteValue === true) {
        // Está sendo marcado como deletado → reverter a movimentação
        // Subtrair o que foi aplicado (se foi +50, remove; se foi -30, adiciona)
        newQuantity = currentQuantity - movementQty;
        console.log(`[TOGGLE DELETAR] Item ${item.id}: ${currentQuantity} - (${movementQty}) = ${newQuantity}`);
      } else {
        // Está sendo desmarcado (reativado) → reaplicar a movimentação
        // Adicionar novamente (se é +50, adiciona; se é -30, subtrai)
        newQuantity = currentQuantity + movementQty;
        console.log(`[TOGGLE REATIVAR] Item ${item.id}: ${currentQuantity} + (${movementQty}) = ${newQuantity}`);
      }

      // Validar se a quantidade não fica negativa
      if (newQuantity < 0) {
        throw new Error(
          `Operação resultaria em estoque negativo para o item ${item.name}. ` +
            `Quantidade atual: ${currentQuantity}, Movimento: ${movementQty}, ` +
            `Resultado: ${newQuantity}`
        );
      }

      // Atualizar a quantidade do item
      console.log(`[UPDATE] Atualizando item ${item.id} de ${currentQuantity} para ${newQuantity}`);
      await updateItemQuantity(item.id!, newQuantity);
      console.log(`[UPDATE] Item ${item.id} atualizado com sucesso`);
    }

    // 4. Atualizar o safe_delete conforme escopo
    if (typeof movement_id === "number" && movement_id > 0) {
      const { error } = await supabase
        .from("movement_history")
        .update({ safe_delete: newSafeDeleteValue })
        .eq("id", movement_id)
        .eq("enterprise_id", enterprise_id);
      if (error) throw new Error(`Falha ao atualizar movimentação: ${error.message}`);
    } else {
      await updateSafeDeleteByGroup(group_id!, newSafeDeleteValue);
    }

    return {
      message: newSafeDeleteValue
        ? "Movimentação marcada como deletada. Quantidades dos itens revertidas."
        : "Movimentação reativada. Quantidades dos itens reaplicadas.",
      group_id: movements[0].group_id,
      movement_id: typeof movement_id === "number" ? movement_id : undefined,
      safe_delete: newSafeDeleteValue,
      items_affected: movements.length,
    };
  } catch (error: any) {
    // ROLLBACK: reverter quantidades dos itens
    console.error("Erro ao alterar safe_delete. Iniciando rollback...", error);

    for (const { id, oldQuantity } of updatedItems) {
      try {
        await updateItemQuantity(id, oldQuantity);
        console.log(
          `Rollback do item ${id}: quantidade restaurada para ${oldQuantity}`
        );
      } catch (rollbackError) {
        console.error(
          `CRÍTICO: Falha no rollback do item ${id}:`,
          rollbackError
        );
      }
    }

    throw new Error(
      `Erro ao alterar safe_delete da movimentação: ${error.message}`
    );
  }
}