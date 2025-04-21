import {criarEmpresa} from "@/lib/service/criar-empresa";


const nomeDaEmpresa: string = 'Nome qualquer fodase';
const nomeDeUsuario: string = 'Cabecinha';
const email: string = 'cabecinha@exemplo.com';
const senha: string = 'senha deveras segura';

criarEmpresa({
    nomeDaEmpresa: nomeDaEmpresa,
    nomeDeUsuario: nomeDeUsuario,
    email: email,
    senha: senha,
});