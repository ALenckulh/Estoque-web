import { supabase } from "@/utils/supabase/supabaseClient";
import { User } from "../../models/user_model";

// Buscar usuário por ID
export async function fetchUserById(id: number): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    // PGRST116 = nenhuma linha encontrada
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Erro ao buscar usuário: ${error.message}`);
  }

  return data as User;
}