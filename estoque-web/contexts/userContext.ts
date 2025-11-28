import { createContext } from "react";

export interface UserContextType {
  findUserId: string | null;
  setFindUserId: (id: string | null) => void;
  isUserClicked?: boolean;
  setIsUserClicked?: (clicked: boolean) => void;
  myUserId?: string | null;
  setMyUserId?: (id: string | null) => void;
  myUserEnterpriseId?: string | null;
  setMyUserEnterpriseId?: (id: string | null) => void;
  OpenModalInactive: boolean;
  setOpenModalInactive: (open: boolean) => void;
  OpenModalActive: boolean;
  setOpenModalActive: (open: boolean) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const userContext = createContext<UserContextType | null>(null);

export default userContext;