"use client"; // se estiver usando Next.js

import { ReactNode, useState } from "react";
import userContext from "@/contexts/userContext";

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [findUserId, setFindUserId] = useState<string | null>(null);
  const [isUserClicked, setIsUserClicked] = useState<boolean>(false);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [OpenModalInactive, setOpenModalInactive] = useState<boolean>(false);
  const [OpenModalActive, setOpenModalActive] = useState<boolean>(false);

  return (
    <userContext.Provider value={{ findUserId, setFindUserId, isUserClicked, setIsUserClicked, myUserId, setMyUserId, OpenModalInactive, setOpenModalInactive, OpenModalActive, setOpenModalActive }}>
      {children}
    </userContext.Provider>
  );
}
