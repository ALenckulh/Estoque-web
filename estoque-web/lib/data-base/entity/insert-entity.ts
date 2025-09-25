import { Entity } from "@/lib/models/entity_model";
import { supabase } from "@/utils/supabase/supabaseClient";

export async function insertEntityDB(entity: Entity) {
  const { data, error } = await supabase
    .from("entity")
    .insert([entity])
    .select()
    .single();

  if (error) throw new Error(`Erro ao criar entidade -> ${error.message}`);
  console.log(`Entidade criada -> ${entity.name}`);
  return data;
}
