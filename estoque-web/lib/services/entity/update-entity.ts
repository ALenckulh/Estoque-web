import { updateEntityDB } from "@/lib/data-base/entity/update-entity";
import { Entity } from "@/lib/models/entity_model";

export async function updateEntity(
  id: string,
  updates: Partial<Omit<Entity, "id" | "enterprise_id" | "created_at">>
) {
  try {
    const entity = await updateEntityDB(id, updates);
    console.log(`Service: entidade atualizada -> ${id}`);
    return entity;
  } catch (error: any) {
    throw new Error(`Erro no service ao atualizar entidade -> ${error.message}`);
  }
}
