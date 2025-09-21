import { User } from "../models/user_model";
import { fetchAllUsers } from "../data-base/selecionar-usuario";

export async function getAllUsers(): Promise<User[]> {
    try {
        const users = await fetchAllUsers();
        return users;
    } catch (error) {
        throw new Error(`Erro ao buscar usuários -> ${error}`);
    }
}
