import { supabase } from "@/utils/supabase/supabaseClient";

export async function selectEntityByIdDB(id: string) {
  const { data, error } = await supabase
    .from("entity")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(`Erro ao buscar entidade -> ${error.message}`);
  return data;
}
5