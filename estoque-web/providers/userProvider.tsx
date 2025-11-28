"use client"; // se estiver usando Next.js

import { ReactNode, useEffect, useState } from "react";
import userContext from "@/contexts/userContext";
import loadAndStoreUserEnterprise from "@/lib/services/user/load-user-enterprise";

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
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Wrapper setter that also persists to localStorage
  const updateMyUserEnterpriseId = (id: string | null) => {
    setMyUserEnterpriseId(id);
    // log for debugging: show enterprise id when it's updated
    if (typeof window !== "undefined") {
      try {
        console.log("myUserEnterpriseId -> updateMyUserEnterpriseId:", id);
      } catch (e) {}
    }
    if (typeof window !== "undefined") {
      try {
        if (id) localStorage.setItem("myUserEnterpriseId", id);
        else localStorage.removeItem("myUserEnterpriseId");
      } catch (e) {
        // ignore storage errors
      }
    }
  };

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // On mount try to populate from localStorage or fetch once
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cached = localStorage.getItem("myUserEnterpriseId");
    if (cached) {
      setMyUserEnterpriseId(cached);
      try {
        console.log("myUserEnterpriseId -> hydrated from localStorage:", cached);
      } catch (e) {}
    } else {
      (async () => {
        try {
          const value = await loadAndStoreUserEnterprise();
          if (value) {
            setMyUserEnterpriseId(value);
            try {
              console.log("myUserEnterpriseId -> loaded from API:", value);
            } catch (e) {}
          }
        } catch (e) {
          // ignore
        }
      })();
    }
  }, []);

  return (
    <userContext.Provider value={{ findUserId, setFindUserId, isUserClicked, setIsUserClicked, myUserId, setMyUserId, myUserEnterpriseId, OpenModalInactive, setOpenModalInactive, OpenModalActive, setOpenModalActive, setMyUserEnterpriseId: updateMyUserEnterpriseId, refreshTrigger, triggerRefresh }}>
      {children}
    </userContext.Provider>
  );
}
