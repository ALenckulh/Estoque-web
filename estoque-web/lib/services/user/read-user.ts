import { selectUserByIdDB } from "@/lib/data-base/user/select-user-by-id";
import { User } from "@/lib/models/user_model";

export async function getUserById(id: string): Promise<User | null> {
  try {
    return await selectUserByIdDB(id);
  } catch (error) {
    throw new Error(`Erro ao buscar usuário -> ${error}`);
  }
}