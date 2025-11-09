"use client";
import { createContext } from "react";

interface AppReadyContextType {
  setAppReady: (ready: boolean) => void;
}

export const AppReadyContext = createContext<AppReadyContextType>({
  setAppReady: () => {},
});