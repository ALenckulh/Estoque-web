import { supabase } from "@/utils/supabase/supabaseClient";

export async function updateSafeDeleteEntityDB(id: string) {
  const { data: currentData, error: fetchError } = await supabase
    .from("entity")
    .select("safe_delete")
    .eq("id", id)
    .single();

  if (fetchError) throw new Error(`Erro ao buscar entidade -> ${fetchError.message}`);

  const newSafeDelete = !currentData.safe_delete;

  const { data, error } = await supabase
    .from("entity")
    .update({ safe_delete: newSafeDelete })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Erro ao mudar status da entidade -> ${error.message}`);
  console.log(`Entidade ${newSafeDelete ? "ativada" : "desativada"} -> ${id}`);
  return data;
}