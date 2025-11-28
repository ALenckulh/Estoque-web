"use client";

import { ReactNode, useState } from "react";
import itemContext from "@/contexts/itemContext";

interface ItemProviderProps {
  children: ReactNode;
}

export function ItemProvider({ children }: ItemProviderProps) {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <itemContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </itemContext.Provider>
  );
}
