import { supabase } from "@/utils/supabase/supabaseClient";

export async function listEntitiesDB() {
  const { data, error } = await supabase
    .from("entity")
    .select("id, name, phone, email, created_at, address, safe_delete")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Erro ao listar entidades -> ${error.message}`);
  return data;
}
