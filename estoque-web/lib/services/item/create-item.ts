import { insertItemDB } from "@/lib/data-base/item/insert-item";
import { Item } from "../../models/item_model";

interface Parameters {
  name: string;
  enterprise_id: number;
  description?: string;
  quantity_alert?: number;
  unit_id?: number;
  segment_id?: number;
  manufacturer?: string;
  position?: string;
  group_id?: number;
}

export async function createItem({
  name,
  enterprise_id,
  description,
  quantity_alert,
  unit_id,
  segment_id,
  manufacturer,
  position,
  group_id,
}: Parameters) {
  try {
    const item = new Item(
      name,
      0,
      Number(enterprise_id),
      description,
      quantity_alert,
      unit_id,
      segment_id,
      manufacturer,
      position,
      group_id
    );
    const inserted = await insertItemDB(item);

    console.log(`Item criado! -> ${name} (id=${inserted.id})`);
    return inserted;
  } catch (error) {
    throw new Error(`Erro ao criar o item -> ${error}`);
  }
}
