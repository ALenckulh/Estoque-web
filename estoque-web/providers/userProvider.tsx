"use client"; // se estiver usando Next.js

import { ReactNode, useEffect, useState } from "react";
import userContext from "@/contexts/userContext";
import loadAndStoreUserEnterprise from "@/lib/services/user/load-user-enterprise";

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [foundUserId, setFoundUserId] = useState<string | null>(null);
  const [isUserClicked, setIsUserClicked] = useState<boolean>(false);
  const [foundUserDisable, setFoundUserDisabled] = useState<boolean>(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState<boolean>(false);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [myUserEnterpriseId, setMyUserEnterpriseId] = useState<string | null>(null);
  const [OpenDialog, setOpenDialog] = useState<boolean>(false);

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

  // Tenta novamente carregar enterprise_id quando obtivermos myUserId mas ainda não temos enterprise
  useEffect(() => {
    if (myUserId && !myUserEnterpriseId) {
      (async () => {
        try {
          const value = await loadAndStoreUserEnterprise();
          if (value) {
            updateMyUserEnterpriseId(value);
          }
        } catch {}
      })();
    }
  }, [myUserId, myUserEnterpriseId]);

  return (
    <userContext.Provider
      value={{
        foundUserId,
        setFoundUserId,
        foundUserDisable,
        setFoundUserDisabled,
        editDrawerOpen,
        setEditDrawerOpen,
        isUserClicked,
        setIsUserClicked,
        myUserId,
        setMyUserId,
        myUserEnterpriseId,
        OpenDialog,
        setOpenDialog,
        setMyUserEnterpriseId: updateMyUserEnterpriseId,
      }}
    >
      {children}
    </userContext.Provider>
  );
}
