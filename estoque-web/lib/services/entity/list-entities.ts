// lib/services/entityService.ts
import { listEntitiesDB } from "@/lib/data-base/entity/list-entities";
import { Entity } from "@/lib/models/entity_model";

export async function listEntities(
  enterprise_id: number,
  filters?: {
    safe_delete?: boolean;
  }
): Promise<Entity[]> {
  try {
    const entities = await listEntitiesDB(enterprise_id, filters);
    console.log(`Service: ${entities.length} entidades listadas`);
    return entities;
  } catch (error: any) {
    throw new Error(`Erro no service ao listar entidades -> ${error.message}`);
  }
}
