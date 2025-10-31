import { supabase } from "@/utils/supabase/supabaseClient";
import { User } from "../../models/user_model";

// Buscar todos os usuários
export async function fetchAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*");

  if (error) {
    throw new Error(`Erro ao buscar usuários: ${error.message}`);
  }

  return data as User[];
}