import { User } from "../models/user_model";
import { updateUserDB } from "../data-base/atualizar-usuario";

interface UpdateParameters {
    name?: string;
    email?: string;
    password?: string;
    admin?: boolean;
    enterprise_id?: number;
}

export async function updateUser(id: number, updates: UpdateParameters): Promise<User> {
    try {
        const updatedUser = await updateUserDB(id, updates);
        return updatedUser;
    } catch (error) {
        throw new Error(`Erro ao atualizar usuário -> ${error}`);
    }
}
