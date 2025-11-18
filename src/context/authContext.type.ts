import type { User } from "firebase/auth";
import type { Role } from "@services/service.type";

export interface AuthContextType {
  authUser: User | null;
  isAuthLoading: boolean;
  role: Role | null;
  userName: string | null;
}
