import { supabase } from "@/utils/supabase/supabaseClient";
import { User } from "../../models/user_model";

export async function deleteUserDB(id: number): Promise<User> {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)
        .select()
        .single();

    if (error) {
        throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }

    return data as User;
}
