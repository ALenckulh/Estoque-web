import { supabase } from "@/utils/supabase/supabaseClient";

export type UnitRow = {
  id: number;
  name: string;
};

/**
 * Lê todas as unidades ativas por enterprise, em ordem alfabética.
 * safe_delete = true e enterprise_id conforme informado.
 */
export async function listUnitsDB(enterprise_id: number): Promise<UnitRow[]> {
  const { data, error } = await supabase
    .from("unit")
    .select("id, name")
    .eq("enterprise_id", enterprise_id)
    .eq("safe_delete", false)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Erro ao listar unidades: ${error.message}`);
  }

  return (data ?? []) as UnitRow[];
}
