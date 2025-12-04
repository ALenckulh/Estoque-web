import { createContext } from "react";

export interface UserContextType {
  foundUserId: string | null;
  setFoundUserId: (id: string | null) => void;
  foundUserDisable?: boolean;
  setFoundUserDisabled?: (v: boolean) => void;
  editDrawerOpen?: boolean;
  setEditDrawerOpen?: (v: boolean) => void;
  isUserClicked?: boolean;
  setIsUserClicked?: (clicked: boolean) => void;
  myUserId?: string | null;
  setMyUserId?: (id: string | null) => void;
  myUserEnterpriseId?: string | null;
  setMyUserEnterpriseId?: (id: string | null) => void;
  OpenDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  isAdmin?: boolean;
  setIsAdmin?: (isAdmin: boolean) => void;
}

const userContext = createContext<UserContextType | null>(null);

export default userContext;