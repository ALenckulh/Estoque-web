import {criarEmpresa} from "@/lib/data_base/criar-empresa";



async function teste(){
    let empresa = await criarEmpresa('teste');
    console.log(empresa);
}

teste();