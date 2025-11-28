"use client";

import { ReactNode, useState } from "react";
import entityContext from "@/contexts/entityContext";

interface EntityProviderProps {
  children: ReactNode;
}

export function EntityProvider({ children }: EntityProviderProps) {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <entityContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </entityContext.Provider>
  );
}
