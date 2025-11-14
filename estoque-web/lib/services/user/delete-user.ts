import { User } from "../../models/user_model";
import { updateSafeDeleteUserDB } from "../../data-base/user/update-safe-delete-user";

export async function deleteUser(id: string): Promise<User> {
    try {
        const deletedUser = await updateSafeDeleteUserDB(id);
        return deletedUser;
    } catch (error) {
        throw new Error(`Erro ao deletar usuário -> ${error}`);
    }
}
