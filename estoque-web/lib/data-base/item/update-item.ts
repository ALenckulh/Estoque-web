import { supabase } from "@/utils/supabase/supabaseClient";
import { Item } from "../../models/item_model";

interface UpdateParameters {
  name?: string;
  description?: string;
  quantity?: number;
  quantity_alert?: number;
  unity?: string;
  segment_id?: number;
  manufacturer?: string;
  position?: string;
  group_id?: number;
}

export async function updateItemDB(id: number, updates: UpdateParameters): Promise<Item> {
  // Garantia extra: se por algum motivo vier enterprise_id no objeto, remove
  const { enterprise_id, ...safeUpdates } = updates as any;

  const { data, error } = await supabase
    .from("items")
    .update(safeUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao atualizar item: ${error.message}`);
  }

  return data as Item;
}