import { supabase } from "@/utils/supabase/supabaseClient";

/**
 * Busca o último group_id registrado na tabela movement_history.
 * Retorna null se não houver nenhum registro.
 */
export async function getLastGroupId(): Promise<number | null> {
  const { data, error } = await supabase
    .from("movement_history")
    .select("group_id")
    .order("group_id", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // Se não houver registros, retornar null
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }

  return data?.group_id ?? null;
}
