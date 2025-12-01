import { useState } from "react";

export type MovementOption = { label: string; value: number };
export type MovementItemRow = { produto: MovementOption | null; quantidade: string | null };

export function useMovementItems(type: "entrada" | "saida") {
  const [productItems, setProductItems] = useState<MovementItemRow[]>([
    { produto: null, quantidade: null },
  ]);

  function addItem() {
    setProductItems((prev) => [...prev, { produto: null, quantidade: null }]);
  }

  function removeItem(index: number) {
    setProductItems((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev
    );
  }

  function updateItem(index: number, field: string, value: any) {
    setProductItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value } as MovementItemRow;
      return copy;
    });
  }

  function extractNumericId(value: any): number | null {
    if (value == null) return null;
    if (typeof value === "number") return value;
    const str = String(value);
    const match = str.match(/\d+/);
    return match ? Number(match[0]) : null;
  }

  function parseQuantity(raw: string | null): number | null {
    if (!raw) return null;
    const normalized = raw.replace(/\./g, "").replace(/,/g, ".");
    const n = Number(normalized);
    if (!Number.isFinite(n)) return null;
    if (type === "entrada") return n > 0 ? n : null;
    // saida precisa ser negativa
    return n > 0 ? -Math.abs(n) : n;
  }

  return {
    productItems,
    setProductItems,
    addItem,
    removeItem,
    updateItem,
    extractNumericId,
    parseQuantity,
  };
}
