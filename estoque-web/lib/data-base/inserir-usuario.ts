import { createClient } from "@/utils/supabase/client";
interface Parametros{
    nomeDeUsuario: string,
    email: string,
    senha: string,
    admin: boolean,
    safeDelete: boolean,
    empresa: number,
}

export async function inserirUsuario({ nomeDeUsuario, email, senha, admin, safeDelete, empresa } : Parametros){

    const { error } = await createClient().from('usuarios').insert([{
        nome: nomeDeUsuario,
        email: email,
        senha: senha,
        admin: admin,
        safe_delete: safeDelete,
        empresa: empresa,
    }])

    // codigo '23505' significa que campo único já existe
    if (error?.code === '23505') {throw new Error('Essse email já existe');}

    console.log(`Usuario ${nomeDeUsuario} inserido com sucesso!`)
}