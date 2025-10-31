import { supabase } from "@/utils/supabase/supabaseClient";
import { User } from "@/lib/models/user_model";

interface UpdateParameters {
    name?: string;
    email?: string;
    password?: string;
    admin?: boolean;
    enterprise_id?: number;
}

export async function updateUserDB(id: number, updates: UpdateParameters): Promise<User> {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }

    return data as User;
}
