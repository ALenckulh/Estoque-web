import { fetchAllUsers } from "@/lib/data-base/users/select-user";
import { User } from "@/lib/models/user_model";


export async function getAllUsers(): Promise<User[]> {
    try {
        const users = await fetchAllUsers();
        return users;
    } catch (error) {
        throw new Error(`Erro ao buscar usuários -> ${error}`);
    }
}
