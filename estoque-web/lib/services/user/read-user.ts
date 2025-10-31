import { fetchUserById } from "../../data-base/user/select-user-by-id";
import { User } from "@/lib/models/user_model";

export async function getUserById(id: number): Promise<User | null> {
  try {
    return await fetchUserById(id);
  } catch (error) {
    throw new Error(`Erro ao buscar usuário -> ${error}`);
  }
}