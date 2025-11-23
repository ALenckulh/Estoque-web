  import { fetchItemById } from "@/lib/data-base/item/fetch-item-by-id";
  import { updateItemQuantity } from "@/lib/data-base/item/update-item-quantity";
  import { getLastGroupId } from "@/lib/data-base/movement/get-last-group-id";
  import { insertMovements } from "@/lib/data-base/movement/insert-movements";
  import { deleteMovementsByGroup } from "@/lib/data-base/movement/delete-movements-by-group";
  import { MovementRecord } from "@/lib/models/movement_model";

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
    if (type !== "entrada" && type !== "saida") {
      throw new Error("Parâmetro 'type' é obrigatório e deve ser 'entrada' ou 'saida'.");
    }
    if (typeof date !== "string" || isNaN(Date.parse(date))) {
      throw new Error("Parâmetro 'date' é obrigatório e deve ser uma string de data ISO válida.");
    }
    if (typeof user_id !== "number" && typeof user_id !== "string") {
      throw new Error("Parâmetro 'user_id' é obrigatório e deve ser um número ou string.");
    }
    if (typeof enterprise_id !== "number") {
      throw new Error("Parâmetro 'enterprise_id' é obrigatório e deve ser um número.");
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Parâmetro 'items' é obrigatório e deve ser um array não vazio.");
    }
    
    // Rastrear alterações para rollback
    const updatedItems: Array<{ id: number; oldQuantity: number }> = [];
    let insertedMovementGroupId: number | null = null;

    try {

      // Buscar o último group_id
      // A maneira feita agora pode causar erros caso seja feita uma movimentação no mesmo momento 
      const lastGroupId = await getLastGroupId();
      const newGroupId = lastGroupId ? lastGroupId + 1 : 1;

      const movementsToInsert: any[] = [];

      for (const { item_id, quantity } of items) {
        const item = await fetchItemById(item_id);

        if (
          !item ||
          item.enterprise_id !== enterprise_id ||
          item.safe_delete === true
        ) {
          throw new Error(`Item inválido ou inativo: ID ${item_id}`);
        }

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

        updatedItems.push({ id: item_id, oldQuantity: item.quantity });

        await updateItemQuantity(item_id, newQuantity);

        movementsToInsert.push(
          new MovementRecord(
            newGroupId,
            date,
            quantity,
            user_id,
            item_id,
            enterprise_id,
            lote,
            nota_fiscal,
            participate_id
          )
        );
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
          console.log(
            `Rollback do item ${id}: quantidade restaurada para ${oldQuantity}`
          );
        } catch (rollbackError) {
          console.error(
            `CRÍTICO: Falha no rollback do item ${id}:`,
            rollbackError
          );
          // Continuar tentando reverter os demais itens
        }
      }

      // 2. Excluir movimentações inseridas (se houver)
      if (insertedMovementGroupId !== null) {
        try {
          await deleteMovementsByGroup(insertedMovementGroupId);
          console.log(
            `Rollback: movimentações do group_id ${insertedMovementGroupId} excluídas`
          );
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
