import { createContext } from "react";

export interface ItemContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const itemContext = createContext<ItemContextType | null>(null);

export default itemContext;
