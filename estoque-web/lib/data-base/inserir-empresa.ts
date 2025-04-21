import { supabase } from "../supabase";

interface Parametros{
    nomeDaEmpresa: string;
}

export async function inserirEmpresa({nomeDaEmpresa}: Parametros){

    const { data, error } = await supabase
        .from('empresas')
        .insert([{ nome: nomeDaEmpresa }]).select('id');

    if (error?.code === '23505') {
        // codigo '23505' significa que campo único já existe
        throw new Error(`Esse nome de empresa já existe`);

    }
    console.log(`Empresa ${nomeDaEmpresa} inserida com sucesso!`)

    return data?.[0]?.id; // Sintaxe do Js aí, credo. '?' diz que não é nulo
}