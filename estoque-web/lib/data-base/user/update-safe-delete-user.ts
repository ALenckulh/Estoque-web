import { supabase } from "@/utils/supabase/supabaseClient";
import { User } from "../../models/user_model";

export async function updateSafeDeleteUserDB(id: string): Promise<User> {
    const { data: currentData, error: fetchError } = await supabase
        .from('users')
        .select('safe_delete')
        .eq('id', id)
        .single();

    if (fetchError) throw new Error(`Erro ao buscar usuário -> ${fetchError.message}`);

    const newSafeDelete = !currentData.safe_delete;

    const { data, error } = await supabase
        .from('users')
        .update({ safe_delete: newSafeDelete })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }

    return data as User;
}
