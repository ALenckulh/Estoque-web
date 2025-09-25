import { selectEntityByIdDB } from "@/lib/data-base/entity/select-entity-by-id";
import { Entity } from "@/lib/models/entity_model";

export async function readEntity(id: string): Promise<Entity> {
  try {
    const entity = await selectEntityByIdDB(id);
    console.log(`Service: entidade encontrada -> ${id}`);
    return entity;
  } catch (error: any) {
    throw new Error(`Erro no service ao buscar entidade -> ${error.message}`);
  }
}
