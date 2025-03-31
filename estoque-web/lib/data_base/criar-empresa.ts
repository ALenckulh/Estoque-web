import { supabase } from "../supabase";

export async function criarEmpresa(nome: String){
    try {
        return await supabase.from('empresas').insert([{ nome }]).select();
    } catch (error){
        return ("Erro ao criar empresa: " + error);
    }
}