import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

import { app } from "@/firebase/firebase";
import { getUserDetails } from "@/services";
import { normalizeRole } from "@/utils/helper";
import type { Role } from "@services/service.type";
import type { AuthContextType } from "./context.type";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [role, setRole] = useState<Role | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const clearUserData = useCallback(() => {
    setAuthUser(null);
    setRole(null);
    setUserName(null);
    setIsAuthLoading(false);
  }, []);

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsAuthLoading(true);

      // checking if firebase user is present or not
      // if not ---
      if (!firebaseUser) {
        clearUserData();
        return;
      }
      // if present --
      try {
        await firebaseUser.reload();
      } catch {
        clearUserData();
        return;
      }
      // set user
      setAuthUser(firebaseUser);
      let currentRole: Role | null = null;

      // set role
      try {
        const tokenResult = await firebaseUser.getIdTokenResult();
        const claimRole = normalizeRole(tokenResult?.claims?.role);
        if (claimRole) {
          currentRole = claimRole;
        }
      } catch {
        currentRole = null;
      }

      // set user details
      try {
        const token = await firebaseUser.getIdToken();

        if (!token) {
          setUserName(null);
        } else {
          const response = await getUserDetails(token);
          if (response?.data) {
            const normalizedResponseRole = normalizeRole(response.data.role);
            setUserName(response.data.username);

            if (normalizedResponseRole) {
              currentRole = normalizedResponseRole;
            }
          } else {
            setUserName(null);
          }
        }
      } catch {
        setUserName(null);
      }

      setRole(currentRole);
      setIsAuthLoading(false);
    });

    return unsubscribe;
  }, [clearUserData]);

  const value: AuthContextType = {
    authUser,
    isAuthLoading,
    role,
    userName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
