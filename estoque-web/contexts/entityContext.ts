import { createContext } from "react";

export interface EntityContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const entityContext = createContext<EntityContextType | null>(null);

export default entityContext;
