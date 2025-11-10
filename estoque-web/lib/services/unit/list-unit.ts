import { listUnitsDB, type UnitRow } from "@/lib/data-base/unit/list-units";

// Serviço para listagem de unidades, seguindo o mesmo formato dos outros services
export async function listUnit(enterprise_id: number): Promise<UnitRow[]> {
  try {
    const units = await listUnitsDB(enterprise_id);
    console.log(`Service: unidades encontradas -> ${units.length} (enterprise ${enterprise_id})`);
    return units;
  } catch (error: any) {
    throw new Error(`Erro no service ao listar unidades -> ${error.message || error}`);
  }
}
