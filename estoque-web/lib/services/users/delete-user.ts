import { User } from "../../models/user_model";
import { deleteUserDB } from "../../data-base/users/delete-user";

export async function deleteUser(id: number): Promise<User> {
    try {
        const deletedUser = await deleteUserDB(id);
        return deletedUser;
    } catch (error) {
        throw new Error(`Erro ao deletar usuário -> ${error}`);
    }
}
