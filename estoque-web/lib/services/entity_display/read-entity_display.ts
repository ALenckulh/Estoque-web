import { readEntityDisplayDB, type EntityDisplayRow } from "@/lib/data-base/entity_display/read-entity_display";

export async function readEntityDisplay(enterprise_id: number): Promise<EntityDisplayRow[]> {
  try {
    const rows: EntityDisplayRow[] = await readEntityDisplayDB(enterprise_id);
    return rows;
  } catch (error: any) {
    throw new Error(`Erro no service ao ler entity_display -> ${error.message || error}`);
  }
}
