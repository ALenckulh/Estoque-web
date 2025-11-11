import { supabase } from "@/utils/supabase/supabaseClient";

export type GroupJson = { id?: number; nome: string };

/**
 * Insere uma lista de grupos a partir do formato de `utils/data/group.json`.
 * Os objetos do JSON usam a chave `nome` — aqui mapeamos para `name` da tabela.
 * Todos os registros são inseridos com `enterprise_id` informado e `safe_delete = true`.
 */
export async function insertGroupsDB(
  groups: GroupJson[],
  enterprise_id: number
) {
  const payload = groups.map((g) => ({
    name: g.nome,
    enterprise_id,
  }));

  const { data, error } = await supabase.from("group_table").insert(payload).select();

  if (error) throw new Error(`Erro ao inserir grupos: ${error.message}`);

  console.log(`Inseridos ${data?.length ?? 0} grupos para enterprise ${enterprise_id}`);
  return data;
}
