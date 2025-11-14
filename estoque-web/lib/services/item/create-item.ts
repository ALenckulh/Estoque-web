import { insertItemDB } from "@/lib/data-base/item/insert-item";
import { Item } from "../../models/item_model";

interface Parameters {
  name: string;
  quantity: number;
  enterprise_id: number;
  description?: string;
  quantity_alert?: number;
  unit?: string;
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
  unit,
  segment_id,
  manufacturer,
  position,
  group_id
}: Parameters) {
  try {
    const item = new Item(
      name,
      quantity,
      enterprise_id,
      description,
      quantity_alert,
      unit,
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
