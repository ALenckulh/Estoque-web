"use client";
import { useContext } from "react";
import { AppReadyContext } from "@/contexts/appReadyContext";

export function useAppReady() {
  return useContext(AppReadyContext);
}
