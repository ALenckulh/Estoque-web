"use client"; // se estiver usando Next.js

import { ReactNode, useEffect, useState } from "react";
import userContext from "@/contexts/userContext";
import { findMyUserId } from "@/lib/services/user/find-my-user-id";

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [findUserId, setFindUserId] = useState<string | null>(null);
  const [isUserClicked, setIsUserClicked] = useState<boolean>(false);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [myUserEnterpriseId, setMyUserEnterpriseId] = useState<string | null>(null);
  const [OpenModalInactive, setOpenModalInactive] = useState<boolean>(false);
  const [OpenModalActive, setOpenModalActive] = useState<boolean>(false);

  useEffect(() => {
    async function loadUserData() {
      try {
        const userId = await findMyUserId();
        setMyUserId(userId);

        const response = await fetch(`/api/user/${userId}`);
        const data = await response.json();

        if (data.success && data.user) {
          setMyUserEnterpriseId(data.user.enterprise_id?.toString() || null);
        } else {
          console.error("Erro ao buscar dados do usuário:", data.message);
          setMyUserEnterpriseId(null);
        }
      } catch (error) {
        console.error("Erro ao buscar ID do usuário logado:", error);
        setMyUserId(null);
        setMyUserEnterpriseId(null);
      }
    }
    loadUserData();
  }, []);

  return (
    <userContext.Provider value={{ findUserId, setFindUserId, isUserClicked, setIsUserClicked, myUserId, myUserEnterpriseId, OpenModalInactive, setOpenModalInactive, OpenModalActive, setOpenModalActive }}>
      {children}
    </userContext.Provider>
  );
}
