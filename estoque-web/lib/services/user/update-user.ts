import { User } from "@/lib/models/user_model";
import { updateUserDB } from "@/lib/data-base/user/update-user";

interface UpdateParameters {
  name?: string;
  is_admin?: boolean;
  passwordChange?: { current: string; next: string };
}

export async function updateUser(
  id: string,
  updates: UpdateParameters
): Promise<User> {
  try {
    const updatedUser = await updateUserDB(id, updates);
    return updatedUser;
  } catch (error) {
    throw new Error(`Erro ao atualizar usuário -> ${error}`);
  }
}