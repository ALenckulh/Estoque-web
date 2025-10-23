import { createContext } from "react";

export interface UserContextType {
  findUserId: string | null;
  setFindUserId: (id: string | null) => void;
  isUserClicked?: boolean;
  setIsUserClicked?: (clicked: boolean) => void;
}

const userContext = createContext<UserContextType | null>(null);

export default userContext;