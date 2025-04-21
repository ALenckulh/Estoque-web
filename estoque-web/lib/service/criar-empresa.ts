import {inserirEmpresa} from "@/lib/data-base/inserir-empresa";
import {inserirUsuario} from "@/lib/data-base/inserir-usuario";


interface Parametros{
    // -- EMPRESA --
    nomeDaEmpresa: string;

    // -- USUARIO --
    nomeDeUsuario: string;
    email: string
    senha: string;
}


export async function criarEmpresa({nomeDaEmpresa, nomeDeUsuario, email, senha}: Parametros){

    try{
        const empresaId = await inserirEmpresa({nomeDaEmpresa: nomeDaEmpresa})
        console.log(`Empresa criada! -> ${nomeDaEmpresa}`)

        await inserirUsuario({
            nomeDeUsuario: nomeDeUsuario,
            email: email,
            senha: senha,
            admin: true,
            safeDelete: false,
            empresa: empresaId,
        })

        console.log(`Usuário criado! -> ${nomeDeUsuario}`)
    }catch (error) {
        throw new Error(`Erro ao criar a empresa -> ${error}`)
    }

}