import { Entity } from "@/lib/models/entity_model";
import { supabase } from "@/utils/supabase/supabaseClient";

export async function updateEntityDB(
  id: string,
  updates: Partial<Omit<Entity, "id" | "enterprise_id" | "created_at">>
) {
  const { data, error } = await supabase
    .from("entity")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Erro ao atualizar entidade -> ${error.message}`);
  console.log(`Entidade atualizada -> ${id}`);
  return data;
}
