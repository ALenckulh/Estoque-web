import { supabase } from "../supabase";

export async function criarEmpresa(nome: String){
    supabase.from('empresas').insert({nome: nome}).select()
}