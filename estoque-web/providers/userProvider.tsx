"use client"; // se estiver usando Next.js

import { ReactNode, useEffect, useState } from "react";
import userContext from "@/contexts/userContext";
import loadAndStoreUserEnterprise from "@/lib/services/user/load-user-enterprise";
import { findMyUserId } from "@/lib/services/user/find-my-user-id";

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
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

  // Wrapper setter that also persists to localStorage
  const updateMyUserEnterpriseId = (id: string | null) => {
    setMyUserEnterpriseId(id);
    if (typeof window !== "undefined") {
      try {
        if (id) localStorage.setItem("myUserEnterpriseId", id);
        else localStorage.removeItem("myUserEnterpriseId");
      } catch (e) {
        // ignore storage errors
      }
    }
  };

  // Wrapper setter for isAdmin that also persists to localStorage
  const updateIsAdmin = (value: boolean | undefined) => {
    setIsAdmin(value);
    if (typeof window !== "undefined") {
      try {
        if (value !== undefined) {
          localStorage.setItem("isAdmin", String(value));
        } else {
          localStorage.removeItem("isAdmin");
        }
      } catch (e) {
        // ignore storage errors
      }
    }
  };

  // On mount try to populate from localStorage or fetch once
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load myUserId first
    (async () => {
      try {
        const userId = await findMyUserId();
        if (userId) {
          setMyUserId(userId);
        }
      } catch (e) {
        console.error("Error loading myUserId:", e);
      }
    })();

    const cached = localStorage.getItem("myUserEnterpriseId");
    const cachedIsAdmin = localStorage.getItem("isAdmin");
    
    if (cached) {
      setMyUserEnterpriseId(cached);
    } else {
      (async () => {
        try {
          const value = await loadAndStoreUserEnterprise();
          if (value) {
            setMyUserEnterpriseId(value);
          }
        } catch (e) {
          // ignore
        }
      })();
    }

    // Load isAdmin from cache only on mount
    if (cachedIsAdmin !== null) {
      setIsAdmin(cachedIsAdmin === "true");
    } else {
      setIsAdmin(undefined);
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

  // Reload isAdmin when myUserId changes
  useEffect(() => {
    if (myUserId) {
      (async () => {
        try {
          const resp = await fetch(`/api/user/${myUserId}`, { credentials: "same-origin" });
          if (!resp.ok) {
            updateIsAdmin(false);
            return;
          }

          const json = await resp.json().catch(() => null);
          const user = json?.data?.user ?? json?.user ?? null;
          const isAdminValue = Boolean(user?.is_admin);
          updateIsAdmin(isAdminValue);
        } catch (e) {
          console.error("Error loading isAdmin:", e);
          updateIsAdmin(false);
        }
      })();
    }
  }, [myUserId]);

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
        isAdmin,
        setIsAdmin: updateIsAdmin,
      }}
    >
      {children}
    </userContext.Provider>
  );
}
