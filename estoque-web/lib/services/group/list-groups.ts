import { GroupRow, listGroupsDB } from "@/lib/data-base/group/list-groups";

// Serviço para leitura de grupos, mesmo formato do read-entity
export async function readGroup(enterprise_id: number): Promise<GroupRow[]> {
	try {
		const groups = await listGroupsDB(enterprise_id);
		console.log(`Service: grupos encontrados -> ${groups.length} (enterprise ${enterprise_id})`);
		return groups;
	} catch (error: any) {
		throw new Error(`Erro no service ao listar grupos -> ${error.message || error}`);
	}
}

