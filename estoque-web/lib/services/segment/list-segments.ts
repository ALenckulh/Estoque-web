import { listSegmentsDB, type SegmentRow } from "@/lib/data-base/segment/list-segments";

// Serviço para listagem de segmentos, mesmo formato adotado para outros services
export async function listSegments(enterprise_id: number): Promise<SegmentRow[]> {
  try {
    const segments = await listSegmentsDB(enterprise_id);
    console.log(`Service: segmentos encontrados -> ${segments.length} (enterprise ${enterprise_id})`);
    return segments;
  } catch (error: any) {
    throw new Error(`Erro no service ao listar segmentos -> ${error.message || error}`);
  }
}
