import { CLEAR_USER, SET_USER } from "./actions.const";
import type { UserData } from "@/services/service.type";

export const setUser = (user: UserData | null) => ({
  type: SET_USER,
  payload: user,
});

export const clearUser = () => ({
  type: CLEAR_USER,
});
