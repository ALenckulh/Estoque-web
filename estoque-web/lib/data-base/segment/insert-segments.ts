import { supabase } from "@/utils/supabase/supabaseClient";

export type SegmentJson = { id?: number; nome: string };

export async function insertSegmentsDB(
  segments: SegmentJson[],
  enterprise_id: number
) {
  const payload = segments.map((s) => ({
    name: s.nome,
    enterprise_id,
  }));

  const { data, error } = await supabase.from("segment").insert(payload).select();

  if (error) throw new Error(`Erro ao inserir segmentos: ${error.message}`);

  console.log(`Inseridos ${data?.length ?? 0} segmentos para enterprise ${enterprise_id}`);
  return data;
}
