import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useDispatch } from "react-redux";

import { app } from "@/firebase/firebase";
import { getUserDetails } from "@/services";
import { clearUser, setUser } from "@store/actions/actions";
import { isValidRole } from "@/utils/helper";
import type { Role } from "@services/service.type";
import type { AuthContextType } from "./context.type";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [role, setRole] = useState<Role | null>(null);

  const clearUserData = () => {
    setAuthUser(null);
    setRole(null);
    dispatch(clearUser());
    setIsAuthLoading(false);
  };

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
        const claimRole = tokenResult?.claims?.role;
        if (isValidRole(claimRole)) {
          currentRole = claimRole;
        }
      } catch {
        currentRole = null;
      }

      // set user details
      try {
        const token = await firebaseUser.getIdToken();

        if (!token) {
          dispatch(clearUser());
        } else {
          const response = await getUserDetails(token);
          if (response?.data) {
            dispatch(setUser(response.data));
            if (isValidRole(response.data.role)) {
              currentRole = response.data.role;
            }
          } else {
            dispatch(clearUser());
          }
        }
      } catch {
        dispatch(clearUser());
      }

      setRole(currentRole);
      setIsAuthLoading(false);
    });

    return unsubscribe;
  }, [dispatch]);

  const value: AuthContextType = {
    authUser,
    isAuthLoading,
    role,
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
