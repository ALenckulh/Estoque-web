import { supabase } from "@/utils/supabase/supabaseClient";

export async function listEntitiesDB(
  enterprise_id: number
) {
  const { data, error } = await supabase
    .from("entity")
    .select("id, name, phone, email, created_at, address, safe_delete")
    .eq("enterprise_id", enterprise_id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Erro ao listar entidades -> ${error.message}`);
  return data;
}
