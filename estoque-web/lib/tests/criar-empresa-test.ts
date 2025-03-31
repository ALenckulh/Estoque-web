import {criarEmpresa} from "@/lib/data_base/criar-empresa";

async function teste(){
    try {
        let empresa = await criarEmpresa("");
        console.log("Empresa criada:", empresa);
    } catch (error) {
        console.error("Erro ao criar empresa:", error);
    }
}

teste();

