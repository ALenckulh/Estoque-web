import { fetchItemById } from "@/lib/data-base/item/fetch-item-by-id";
import { updateItemQuantity } from "@/lib/data-base/item/update-item-quantity";
import { getLastGroupId } from "@/lib/data-base/movement/get-last-group-id";
import { insertMovements } from "@/lib/data-base/movement/insert-movements";
import { deleteMovementsByGroup } from "@/lib/data-base/movement/delete-movements-by-group";

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
  // Rastrear alterações para rollback
  const updatedItems: Array<{ id: number; oldQuantity: number }> = [];
  let insertedMovementGroupId: number | null = null;

  try {
    // Buscar o último group_id
    const lastGroupId = await getLastGroupId();
    const newGroupId = lastGroupId ? lastGroupId + 1 : 1;

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
        // Permitir movimentações mesmo com estoque insuficiente (pode ficar negativo)
        newQuantity -= effectiveQuantity;
      }

      // Salvar quantidade antiga antes de atualizar (para rollback)
      updatedItems.push({ id: item_id, oldQuantity: item.quantity });

      await updateItemQuantity(item_id, newQuantity);

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

    const movements = await insertMovements(movementsToInsert);

    // Marcar que a movimentação foi inserida com sucesso
    insertedMovementGroupId = newGroupId;

    return {
      message: "Movimentação registrada com sucesso.",
      group_id: newGroupId,
      movements,
    };
  } catch (error: any) {
    // ROLLBACK: reverter todas as alterações
    console.error("Erro ao criar movimentação. Iniciando rollback...", error);

    // 1. Reverter quantidades dos itens
    for (const { id, oldQuantity } of updatedItems) {
      try {
        await updateItemQuantity(id, oldQuantity);
        console.log(`Rollback do item ${id}: quantidade restaurada para ${oldQuantity}`);
      } catch (rollbackError) {
        console.error(`CRÍTICO: Falha no rollback do item ${id}:`, rollbackError);
        // Continuar tentando reverter os demais itens
      }
    }

    // 2. Excluir movimentações inseridas (se houver)
    if (insertedMovementGroupId !== null) {
      try {
        await deleteMovementsByGroup(insertedMovementGroupId);
        console.log(`Rollback: movimentações do group_id ${insertedMovementGroupId} excluídas`);
      } catch (deleteError) {
        console.error(
          `CRÍTICO: Falha ao excluir movimentações do group_id ${insertedMovementGroupId}:`,
          deleteError
        );
      }
    }

    throw new Error(`Erro ao criar movimentação: ${error.message}`);
  }
}