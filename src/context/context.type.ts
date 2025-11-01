import { Role } from "@services/service.type";

export interface AuthContextType {
  authUser: AuthUser | null;
  isAuthLoading: boolean;
  role: Role | null;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
}
