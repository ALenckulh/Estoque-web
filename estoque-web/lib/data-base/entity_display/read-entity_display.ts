import { supabase } from "@/utils/supabase/supabaseClient";

export type EntityDisplayRow = {
  id: number;
  entity_display: string;
};

/**
 * Lê todos os entity_display da tabela entity_display para um enterprise_id específico.
 * Retorna array de registros (ou vazio se não encontrado).
 */
export async function readEntityDisplayDB(enterprise_id: number): Promise<EntityDisplayRow[]> {
  const { data, error } = await supabase
    .from("entity_display")
    .select("id, entity_display")
    .eq("enterprise_id", enterprise_id)
    .order("entity_display", { ascending: true });

  if (error) {
    throw new Error(`Erro ao ler entity_display: ${error.message}`);
  }

  return (data as EntityDisplayRow[]) ?? [];
}
