import { supabase } from "@/utils/supabase/supabaseClient";

export async function updateSafeDeleteEntityDB(id: string, ativo: boolean) {
  const { data, error } = await supabase
    .from("entity")
    .update({ safe_delete: ativo })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Erro ao mudar status da entidade -> ${error.message}`);
  console.log(`Entidade ${ativo ? "ativada" : "desativada"} -> ${id}`);
  return data;
}