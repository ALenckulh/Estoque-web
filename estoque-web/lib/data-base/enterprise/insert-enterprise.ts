import { supabase } from "@/utils/supabase/supabaseClient";

export type EnterpriseRow = {
  id: number;
  created_at: string;
};

/**
 * Insere um registro na tabela `enterprise` sem precisar passar dados.
 * A tabela usa valores padrão (id sequencial, created_at preenchido pelo banco).
 * Retorna { id, created_at } do novo registro.
 */
export async function insertEnterpriseDB(): Promise<EnterpriseRow> {
  const { data, error } = await supabase
    .from("enterprise")
    .insert({})
    .select("id, created_at")
    .single();

  // 23505 = unique violation
  if (error?.code === "23505") {
    throw new Error("Enterprise já existe (chave duplicada).");
  }

  if (error) {
    throw new Error(`Erro ao inserir enterprise: ${error.message}`);
  }

  console.log(`Enterprise inserida: ${JSON.stringify(data)}`);
  return data as EnterpriseRow;
}
