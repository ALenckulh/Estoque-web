import { supabase } from "@/utils/supabase/supabaseClient";

export async function listEntitiesDB(
  enterprise_id: number,
  filters?: {
    safe_delete?: boolean;
  }
) {
  let query = supabase
    .from("entity")
    .select("id, name, phone, email, created_at, address, safe_delete")
    .eq("enterprise_id", enterprise_id);

  // Apply filters at DB level
  if (filters && typeof filters.safe_delete === "boolean") {
    query = query.eq("safe_delete", filters.safe_delete);
  }

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) throw new Error(`Erro ao listar entidades -> ${error.message}`);
  return data;
}
