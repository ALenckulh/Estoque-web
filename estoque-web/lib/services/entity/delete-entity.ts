// lib/services/entityService.ts
import { updateSafeDeleteEntityDB } from "@/lib/data-base/entity/update-safe-delete-entity";
import { Entity } from "@/lib/models/entity_model";


export async function deleteEntity (id: string, ativo: boolean): Promise<Entity> {
  try {
    const entity = await updateSafeDeleteEntityDB(id, ativo);
    console.log(`Service: status atualizado -> ${id}`);
    return entity;
  } catch (error: any) {
    throw new Error(`Erro no service ao atualizar status -> ${error.message}`);
  }
}
