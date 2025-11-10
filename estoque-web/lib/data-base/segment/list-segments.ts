import { supabase } from "@/utils/supabase/supabaseClient";

export type SegmentRow = {
  id: number;
  name: string;
};

/**
 * Lê todos os segmentos ativos por enterprise, em ordem alfabética.
 * safe_delete = true e enterprise_id conforme informado.
 */
export async function listSegmentsDB(enterprise_id: number): Promise<SegmentRow[]> {
  const { data, error } = await supabase
    .from("segment")
    .select("id, name")
    .eq("enterprise_id", enterprise_id)
    .eq("safe_delete", true)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Erro ao listar segmentos: ${error.message}`);
  }

  return (data ?? []) as SegmentRow[];
}
