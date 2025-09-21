import { insertUser } from "@/lib/data-base/inserir-usuario";
import { User } from "../models/user_model";


interface Parameters {
    // -- USUARIO --
    name: string;
    email: string
    password: string;
}

export async function createUser({ name, email, password }: Parameters) {

    try {
        const user = new User(name, email, password);
        await insertUser(user)

        console.log(`Usuário criado! -> ${name}`)
        return user;
    } catch (error) {
        throw new Error(`Erro ao criar o usuário -> ${error}`)
    }

}