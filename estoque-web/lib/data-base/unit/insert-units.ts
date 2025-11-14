import { supabase } from "@/utils/supabase/supabaseClient";

export type UnitJson = { id?: number; nome: string };

/**
 * Insere uma lista de unidades a partir do formato de `utils/data/unit.json`.
 * Mapeia `nome` -> `name`, adiciona `enterprise_id` e `safe_delete = true`.
 */
export async function insertUnitsDB(units: UnitJson[], enterprise_id: number) {
  const payload = units.map((u) => ({
    name: u.nome,
    enterprise_id,
  }));

  const { data, error } = await supabase.from("unit").insert(payload).select();

  if (error) throw new Error(`Erro ao inserir unidades: ${error.message}`);

  console.log(`Inseridas ${data?.length ?? 0} unidades para enterprise ${enterprise_id}`);
  return data;
}
