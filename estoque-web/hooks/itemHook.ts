import { useContext } from "react";
import itemContext, { ItemContextType } from "@/contexts/itemContext";

export function useItem(): ItemContextType {
  const context = useContext(itemContext);
  if (!context) {
    throw new Error("useItem must be used within an ItemProvider");
  }
  return context;
}
