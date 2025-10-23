"use client"; // se estiver usando Next.js

import { ReactNode, useState } from "react";
import userContext from "@/contexts/userContext";

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [findUserId, setFindUserId] = useState<string | null>(null);
  const [isUserClicked, setIsUserClicked] = useState<boolean>(false);

  return (
    <userContext.Provider value={{ findUserId, setFindUserId, isUserClicked, setIsUserClicked }}>
      {children}
    </userContext.Provider>
  );
}
