import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";

import { app } from "@/firebase/firebase";
import { getUserDetails } from "@/services";
import { USER_ROLE_VALUES } from "@services/service.const";
import { clearUser, setUser } from "@store/actions/actions";
import type { Role } from "@services/service.type";
import type { AuthContextType, AuthUser } from "./context.type";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isValidRole = (value: unknown): value is Role => USER_ROLE_VALUES.includes(value as Role);

export const AuthProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsAuthLoading(true);

      // checking if firebase user is present or not
      // if not ---
      if (!firebaseUser) {
        setAuthUser(null);
        setRole(null);
        dispatch(clearUser());
        setIsAuthLoading(false);
        return;
      }

      // if present --
      try {
        await firebaseUser.reload();
      } catch {
        setAuthUser(null);
        setRole(null);
        dispatch(clearUser());
        setIsAuthLoading(false);
        return;
      }

      // set user
      setAuthUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        emailVerified: firebaseUser.emailVerified,
      });

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
