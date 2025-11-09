"use client";
import { ReactNode, useState } from "react";
import { Loading } from "@/components/Feedback/Loading";
import { AppReadyContext } from "@/contexts/appReadyContext";

interface AppReadyProviderProps {
  children: ReactNode;
}

export function AppReadyProvider({ children }: AppReadyProviderProps) {
  const [isAppReady, setAppReady] = useState(false);

  return (
    <AppReadyContext.Provider value={{ setAppReady }}>
      {!isAppReady && <Loading />}
      {children}
    </AppReadyContext.Provider>
  );
}
