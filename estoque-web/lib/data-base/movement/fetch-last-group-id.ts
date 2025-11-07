import { supabase } from "@/utils/supabase/supabaseClient";

export async function fetchLastGroupId(): Promise<number | null> {
  const { data, error } = await supabase
    .from("movement_history")
    .select("group_id")
    .order("group_id", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Erro ao buscar último group_id: ${error.message}`);
  }

  return data?.group_id ?? null;
}