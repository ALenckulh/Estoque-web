// lib/services/entityService.ts
import { updateEntityDB } from "@/lib/data-base/entity/update-entity";
import { Entity } from "@/lib/models/entity_model";

// Interface para campos editáveis de uma entidade
export interface UpdateEntityParams {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  safe_delete?: boolean;
}

export async function updateEntityService(
  id: string,
  updates: UpdateEntityParams
): Promise<Entity> {
  try {
    const updatedEntity = await updateEntityDB(id, updates);
    console.log(`Service: entidade atualizada -> ${id}`);
    return updatedEntity;
  } catch (error: any) {
    throw new Error(
      `Erro no service ao atualizar entidade -> ${error.message}`
    );
  }
}
