import { supabase } from "../supabase";

export async function criarEmpresa(nome_empresa: String, nome_usuario: String, senha: String){

    // TODO verificar se já existe uma empresa com esse nome
    // TODO verificar se é um email válido '@nome_da_empresa.com' ou '@gmai.com'
    // TODO verificar se já existe uma empresa com esse email

    try {
        const empresa_query = await supabase.from('empresas').insert([{ nome_empresa }]).select();
    } catch (error){
        return ("Erro ao criar empresa: " + error);
    }

    try {
        // TODO hashar a senha antes de inserir no db
        // @ts-ignore
        const dono_query = await supabase.from('usuarios').insert([{nome: nome_usuario, senha: senha, admin: true, safe_delete: false, }]).select(); // TODO adicionar empresa_id
    }catch (error){
        // TODO excluir a empresa criada pois não foi possivel criar um dono
        return ("Erro ao criar dono da empresa: " + error);
    }
}