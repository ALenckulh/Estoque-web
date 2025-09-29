import { supabase } from "@/utils/supabase/supabaseClient";
import { User } from "../../models/user_model";

export async function insertUser(user: User) {

    const { error } = await supabase
        .from('users')
        .insert(user)

    // codigo '23505' significa que campo único já existe
    if (error?.code === '23505') { throw new Error('Esse email já existe'); }

    console.log(`Usuario ${user.name} inserido com sucesso!`)
}