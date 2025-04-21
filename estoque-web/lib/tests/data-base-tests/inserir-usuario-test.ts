import { inserirUsuario} from "@/lib/data-base/inserir-usuario";


const nomeDeUsuario: string = 'nome 1';
const email: string = 'email 1';
const senha: string = 'senha 1';
const admin: boolean = true;
const safeDelete: boolean = false;
const empresaId: number = 10;

inserirUsuario({
    nomeDeUsuario: nomeDeUsuario,
    email: email,
    senha: senha,
    admin: admin,
    safeDelete: safeDelete,
    empresa: empresaId,
})