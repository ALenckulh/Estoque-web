import { supabase } from "@/utils/supabase/supabaseClient";
import { User } from "@/lib/models/user_model";
import { insertUser } from "@/lib/data-base/user/insert-user";

export interface CreateUserParams {
    email: string;
    password: string;
    enterprise_id: number;
    is_admin: boolean;
    is_owner: boolean;
    name?: string;
}

export async function createUser({
    email,
    password,
    enterprise_id,
    is_admin,
    is_owner,
    name,
}: CreateUserParams): Promise<User> {
    // 1) Cria no Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: name ? { data: { name } } : undefined,
    });

    if (signUpError || !signUpData?.user) {
        throw new Error(`Erro ao criar usuário no Auth: ${signUpError?.message || "Desconhecido"}`);
    }

    const authUserId = signUpData.user.id;

    const newUser = new User(authUserId, enterprise_id, is_admin, false, is_owner, name, email);
    await insertUser(newUser);

    return newUser;
}