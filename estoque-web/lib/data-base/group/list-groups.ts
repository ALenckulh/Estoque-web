import { supabase } from "@/utils/supabase/supabaseClient";

export type GroupRow = {
  id: number;
  name: string;
};

/**
 * Lê todos os grupos (group_table) ativos por enterprise, em ordem alfabética.
 * - safe_delete = true (conforme solicitado)
 * - enterprise_id = informado
 * - ordenado por name ASC
 */
export async function listGroupsDB(enterprise_id: number): Promise<GroupRow[]> {
  const { data, error } = await supabase
    .from("group_table")
    .select("id, name")
    .eq("enterprise_id", enterprise_id)
    .eq("safe_delete", false)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Erro ao listar grupos: ${error.message}`);
  }

  return (data ?? []) as GroupRow[];
}
