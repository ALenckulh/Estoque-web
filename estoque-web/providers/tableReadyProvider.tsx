"use client";
import { ReactNode, useEffect, useState } from "react";
import { Loading } from "@/components/Feedback/Loading";
import { TableReadyContext } from "@/contexts/tableReadyContext";

interface AppReadyProviderProps {
  children: ReactNode;
}

export function AppReadyProvider({ children }: AppReadyProviderProps) {
  const [thereIsTable, setThereIsTable] = useState(false);
  const [isTableReady, setTableReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  console.log("thereIsTable", thereIsTable);
  console.log("isTableReady", isTableReady);
  console.log("mounted", mounted);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <TableReadyContext.Provider value={{ setTableReady, setThereIsTable }}>
      {thereIsTable ? !isTableReady && mounted && <Loading /> : mounted && <Loading />}
      {children}
    </TableReadyContext.Provider>
  );
}
