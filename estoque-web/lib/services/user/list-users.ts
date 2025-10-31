import { fetchAllUsers } from "../../data-base/user/list-users";
import { User } from "../../models/user_model";

export async function listUsers(): Promise<User[]> {
  try {
    return await fetchAllUsers();
  } catch (error) {
    throw new Error(`Erro ao listar usuários -> ${error}`);
  }
}