import { useContext } from "react";
import entityContext, { EntityContextType } from "@/contexts/entityContext";

export function useEntity(): EntityContextType {
  const context = useContext(entityContext);
  if (!context) {
    throw new Error("useEntity must be used within an EntityProvider");
  }
  return context;
}
