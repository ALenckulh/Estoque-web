import { readItemDisplayDB, type ItemDisplayRow } from "@/lib/data-base/item_display/read-item_display";

export async function readItemDisplay(enterprise_id: number): Promise<ItemDisplayRow[]> {
  try {
    const rows: ItemDisplayRow[] = await readItemDisplayDB(enterprise_id);
    return rows;
  } catch (error: any) {
    throw new Error(`Erro no service ao ler item_display -> ${error.message || error}`);
  }
}
