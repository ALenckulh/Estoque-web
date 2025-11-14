// lib/services/entityService.ts
import { updateSafeDeleteEntityDB } from "@/lib/data-base/entity/update-safe-delete-entity";
import { Entity } from "@/lib/models/entity_model";


export async function deleteEntity (id: string): Promise<Entity> {
  try {
    const entity = await updateSafeDeleteEntityDB(id);
    console.log(`Service: status atualizado (toggle) -> ${id}`);
    return entity;
  } catch (error: any) {
    throw new Error(`Erro no service ao atualizar status -> ${error.message}`);
  }
}
