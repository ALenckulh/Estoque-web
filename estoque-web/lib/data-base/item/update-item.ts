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
  enterprise_id?: number;
}

export async function updateItemDB(id: number, updates: UpdateParameters): Promise<Item> {
  const { data, error } = await supabase
    .from('items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao atualizar item: ${error.message}`);
  }

  return data as Item;
}
