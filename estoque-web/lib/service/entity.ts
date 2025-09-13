import { supabase } from "@/lib/supabase";

export interface Entity {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  enterprise_id: string;
  safe_delete?: boolean;
  created_at?: string;
}

// CRIAR ENTIDADE 
export async function criarEntity(entity: Entity) {
  try {
    const { data, error } = await supabase
      .from("entity")
      .insert([entity])
      .select()
      .single();

    if (error) throw error;
    console.log(`Entidade criada -> ${entity.name}`);
    return data;
  } catch (err) {
    throw new Error(`Erro ao criar entidade -> ${err}`);
  }
}

// LISTAR ENTIDADES 
export async function listarEntities() {
  try {
    const { data, error } = await supabase
      .from("entity")
      .select("id, name, phone, email, created_at, address, safe_delete")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    throw new Error(`Erro ao listar entidades -> ${err}`);
  }
}

// BUSCAR POR ID 
export async function buscarEntityPorId(id: string) {
  try {
    const { data, error } = await supabase
      .from("entity")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    throw new Error(`Erro ao buscar entidade -> ${err}`);
  }
}

// ATUALIZAR ENTIDADE 
export async function atualizarEntity(
  id: string,
  updates: Partial<Omit<Entity, "id" | "enterprise_id" | "created_at">>
) {
  try {
    const { data, error } = await supabase
      .from("entity")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    console.log(`Entidade atualizada -> ${id}`);
    return data;
  } catch (err) {
    throw new Error(`Erro ao atualizar entidade -> ${err}`);
  }
}

// ATIVAR/DESATIVAR (SAFE DELETE)
export async function toggleActive(id: string, ativo: boolean) {
  try {
    const { data, error } = await supabase
      .from("entity")
      .update({ safe_delete: !ativo })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    console.log(`Entidade ${ativo ? "ativada" : "desativada"} -> ${id}`);
    return data;
  } catch (err) {
    throw new Error(`Erro ao mudar status da entidade -> ${err}`);
  }
}
