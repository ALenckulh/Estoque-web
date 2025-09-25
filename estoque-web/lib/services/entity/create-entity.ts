import { Entity } from "@/lib/models/entity_model";
import { insertEntityDB } from "@/lib/data-base/entity/insert-entity";

export async function createEntity(entity: Entity): Promise<Entity> {
  try {
    const createdEntity = await insertEntityDB(entity);
    console.log(`Service: entidade criada -> ${entity.name}`);
    return createdEntity;
  } catch (error: any) {
    throw new Error(`Erro no service ao criar entidade -> ${error.message}`);
  }
}
