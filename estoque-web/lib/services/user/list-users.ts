import { listUsersDB } from "@/lib/data-base/user/list-users";
import { User } from "../../models/user_model";

export async function listUsers(
  enterprise_id: number,
  filters?: {
    safe_delete?: boolean;
  }
): Promise<User[]> {
  try {
    return await listUsersDB(enterprise_id, filters);
  } catch (error) {
    throw new Error(`Erro ao listar usuários -> ${error}`);
  }
}