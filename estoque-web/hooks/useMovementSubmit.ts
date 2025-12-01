import { useState } from "react";
import { api } from "@/utils/axios";
import { QueryClient } from "@tanstack/react-query";

interface MovementSubmitParams {
  type: "entrada" | "saida";
  enterpriseId: number | string | null | undefined;
  userId: string | null | undefined;
  selectedEntityOption: { value: any } | null;
  nf: string;
  lote: string;
  movementDate: string;
  productItems: Array<{ produto: any; quantidade: string | null }>;
  parseQuantity: (raw: string | null) => number | null;
  extractNumericId: (raw: any) => number | null;
  showToast: (msg: string, type: string, icon?: string) => void;
  queryClient: QueryClient;
  validateNF?: (nf: string) => string | null;
  validateEntitySelected: (opt: any) => string | null;
  validateRows: (rows: any) => { valid: boolean; errors?: any[] };
  setNfError: (v: string) => void;
  setEntityError: (v: string) => void;
  setProductErrors: (v: any[]) => void;
  onReset: () => void;
}

export function useMovementSubmit(params: MovementSubmitParams) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleConfirm() {
    const {
      type,
      enterpriseId,
      userId,
      selectedEntityOption,
      nf,
      lote,
      movementDate,
      productItems,
      parseQuantity,
      extractNumericId,
      showToast,
      queryClient,
      validateNF,
      validateEntitySelected,
      validateRows,
      setNfError,
      setEntityError,
      setProductErrors,
      onReset,
    } = params;

    setNfError("");
    setEntityError("");
    setProductErrors([]);

    const nfErr = nf ? validateNF?.(nf) : null;
    if (nfErr) setNfError(nfErr);

    const entErr = validateEntitySelected(selectedEntityOption);
    if (entErr) setEntityError(entErr);

    const rowsResult = validateRows(productItems as any);
    if (!rowsResult.valid) setProductErrors(rowsResult.errors || []);

    if (nfErr || entErr || !rowsResult.valid) return;

    if (!enterpriseId || !userId) {
      showToast("Empresa ou usuário não identificado.", "error", "X");
      return;
    }

    const participate_id = extractNumericId(selectedEntityOption?.value);
    if (!participate_id) {
      showToast(
        type === "entrada" ? "Fornecedor inválido." : "Cliente inválido.",
        "error",
        "X"
      );
      return;
    }

    const itemsPayload: { item_id: number; quantity: number }[] = [];
    for (let i = 0; i < productItems.length; i++) {
      const row = productItems[i];
      if (!row.produto || !row.quantidade) continue;
      const itemId = extractNumericId(row.produto.value);
      if (!itemId) {
        showToast(`Item inválido na linha ${i + 1}.`, "error", "X");
        return;
      }
      const q = parseQuantity(row.quantidade);
      const invalidEntrada = type === "entrada" && (q == null || q <= 0);
      const invalidSaida = type === "saida" && (q == null || q >= 0);
      if (invalidEntrada || invalidSaida) {
        showToast(`Quantidade inválida na linha ${i + 1}.`, "error", "X");
        return;
      }
      itemsPayload.push({ item_id: itemId, quantity: q! });
    }

    if (!itemsPayload.length) {
      showToast("Nenhum item válido para movimentação.", "error", "X");
      return;
    }

    const payload = {
      type,
      enterprise_id: Number(enterpriseId),
      user_id: userId,
      nota_fiscal: nf || undefined,
      lote: lote || undefined,
      date: movementDate,
      participate_id,
      items: itemsPayload,
    } as const;

    try {
      setIsSubmitting(true);
      const resp = await api.post("/movement", payload);
      if (resp?.data?.success) {
        showToast("Movimentação registrada com sucesso.", "success", "Check");
        queryClient.invalidateQueries({
          queryKey: ["movements", enterpriseId],
        });
        onReset();
      } else {
        const msg = resp?.data?.message || "Falha ao registrar movimentação.";
        showToast(msg, "error", "X");
      }
    } catch (err: any) {
      showToast(err?.message || "Erro inesperado ao registrar.", "error", "X");
    } finally {
      setIsSubmitting(false);
    }
  }

  return { isSubmitting, handleConfirm };
}
