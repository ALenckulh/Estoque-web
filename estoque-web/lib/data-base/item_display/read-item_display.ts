import { supabase } from "@/utils/supabase/supabaseClient";

// A tabela real (conforme screenshot) possui colunas: id, name, enterprise_id, display_name.
// O usuário solicitou retornar apenas id e name.
export type ItemDisplayRow = {
  id: number;
  display_name: string;
};

/**
 * Lê todos os registros de item_display para um enterprise_id específico.
 * Retorna array somente com { id, name }.
 */
export async function readItemDisplayDB(enterprise_id: number): Promise<ItemDisplayRow[]> {
  const { data, error } = await supabase
    .from("item_display")
    .select("id, display_name")
    .eq("enterprise_id", enterprise_id)
    .order("display_name", { ascending: true });

  if (error) {
    throw new Error(`Erro ao ler item_display: ${error.message}`);
  }

  return (data as ItemDisplayRow[]) ?? [];
}
