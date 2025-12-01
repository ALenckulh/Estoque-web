import { insertItemDB } from "@/lib/data-base/item/insert-item";
import { Item } from "../../models/item_model";

interface Parameters {
  name: string;
  quantity: number;
  enterprise_id: number;
  description?: string;
  quantity_alert?: number;
  unit_id?: number;
  unit?: string; // legado: se vier string, será convertido para unit_id
  segment_id?: number;
  manufacturer?: string;
  position?: string;
  group_id?: number;
}

export async function createItem({
  name,
  quantity,
  enterprise_id,
  description,
  quantity_alert,
  unit_id,
  unit,
  segment_id,
  manufacturer,
  position,
  group_id,
}: Parameters) {
  try {
    // mapear unit (string) para unit_id (number) quando necessário
    const resolvedUnitId =
      typeof unit_id === "number"
        ? unit_id
        : unit != null && unit !== ""
          ? Number(unit)
          : undefined;

    const item = new Item(
      name,
      quantity,
      enterprise_id,
      description,
      quantity_alert,
      // O modelo Item usa `unit` (string); manter compat enquanto não migramos o modelo
      resolvedUnitId != null ? String(resolvedUnitId) : undefined,
      segment_id,
      manufacturer,
      position,
      group_id
    );
    await insertItemDB(item);

    console.log(`Item criado! -> ${name}`);
    return item;
  } catch (error) {
    throw new Error(`Erro ao criar o item -> ${error}`);
  }
}
