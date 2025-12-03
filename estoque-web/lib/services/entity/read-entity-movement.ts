// /lib/services/entity/read-entity.ts
import { selectEntityByIdDB } from "@/lib/data-base/entity/select-entity-by-id";
import { Entity } from "@/lib/models/entity_model";

export async function readEntity(id: string): Promise<Entity | null> {
  try {
    const result = await selectEntityByIdDB(id);

    if (!result || (Array.isArray(result) && result.length === 0)) {
      return null; // Entidade não encontrada
    }

    const entity = Array.isArray(result) ? result[0] : result;

    // Garantir que é JSON puro
    return JSON.parse(JSON.stringify(entity));
  } catch (error) {
    console.error("Erro no service readEntity:", error);
    return null; // Nunca lança erro para não quebrar o endpoint
  }
}
