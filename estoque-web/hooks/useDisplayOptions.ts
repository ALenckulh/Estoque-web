import { useEffect, useRef, useState } from "react";
import { api } from "@/utils/axios";

export type DisplayOption = { label: string; value: number };

interface UseDisplayOptionsResult {
  produtoOptions: DisplayOption[];
  entitiesOptions: DisplayOption[];
  loadingDisplays: boolean;
  reload: () => Promise<void>;
}

export function useDisplayOptions(
  enterpriseId: number | string | null | undefined,
  showToast?: (msg: string, type?: "success" | "error", icon?: any) => void
): UseDisplayOptionsResult {
  const [produtoOptions, setProdutoOptions] = useState<DisplayOption[]>([]);
  const [entitiesOptions, setEntitiesOptions] = useState<DisplayOption[]>([]);
  const [loadingDisplays, setLoadingDisplays] = useState(false);
  const loadedOnceRef = useRef(false);

  async function load() {
    if (!enterpriseId) return;
    setLoadingDisplays(true);
    try {
      const [itemsResp, entitiesResp] = await Promise.all([
        api.get("/item_display", {
          headers: { "x-enterprise-id": String(enterpriseId) },
        }),
        api.get("/entity_display", {
          headers: { "x-enterprise-id": String(enterpriseId) },
        }),
      ]);
      const itemRows = itemsResp?.data?.items || [];
      const entityRows = entitiesResp?.data?.entities || [];
      setProdutoOptions(
        itemRows.map((r: any) => ({
          label: r.display_name || `Item (${r.id})`,
          value: r.id,
        }))
      );
      setEntitiesOptions(
        entityRows.map((r: any) => ({
          label: r.entity_display || `Entidade (${r.id})`,
          value: r.id,
        }))
      );
      loadedOnceRef.current = true;
    } catch (err: any) {
      showToast?.(
        err?.message || "Erro ao carregar display de itens/entidades",
        "error",
        "X"
      );
    } finally {
      setLoadingDisplays(false);
    }
  }

  useEffect(() => {
    if (!enterpriseId) return;
    if (loadedOnceRef.current) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterpriseId]);

  return { produtoOptions, entitiesOptions, loadingDisplays, reload: load };
}
