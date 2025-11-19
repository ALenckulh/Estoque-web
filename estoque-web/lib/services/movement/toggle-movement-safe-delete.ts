import { fetchItemById } from "@/lib/data-base/item/fetch-item-by-id";
import { updateItemQuantity } from "@/lib/data-base/item/update-item-quantity";
import { fetchMovementsByGroupId } from "@/lib/data-base/movement/fetch-movements-by-group";
import { updateSafeDeleteByGroup } from "@/lib/data-base/movement/update-safe-delete-by-group";

interface ToggleMovementSafeDeleteParams {
  group_id: number;
  enterprise_id: number;
}

export async function toggleMovementSafeDelete({
  group_id,
  enterprise_id,
}: ToggleMovementSafeDeleteParams) {
  const updatedItems: Array<{ id: number; oldQuantity: number }> = [];
  let newSafeDeleteValue: boolean | null = null;

  try {
    // 1. Buscar todas as movimentações do grupo
    const movements = await fetchMovementsByGroupId(group_id, enterprise_id);

    if (!movements || movements.length === 0) {
      throw new Error(
        `Nenhuma movimentação encontrada para o grupo ${group_id}`
      );
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

    // 4. Atualizar o safe_delete de todas as movimentações do grupo
    await updateSafeDeleteByGroup(group_id, newSafeDeleteValue);

    return {
      message: newSafeDeleteValue
        ? "Movimentação marcada como deletada. Quantidades dos itens revertidas."
        : "Movimentação reativada. Quantidades dos itens reaplicadas.",
      group_id,
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