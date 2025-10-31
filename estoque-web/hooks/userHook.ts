import { useContext } from "react";
import userContext from "@/contexts/userContext";

export function useUser() {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
}
