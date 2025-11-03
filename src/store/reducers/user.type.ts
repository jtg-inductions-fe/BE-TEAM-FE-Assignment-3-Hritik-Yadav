import { CLEAR_USER, SET_USER } from "./user.const";
import type { UserData } from "@services/service.type";

export interface UserState {
  user: UserData | null;
}

export type SetUserAction = {
  type: typeof SET_USER;
  payload: UserData | null;
};

export type ClearUserAction = {
  type: typeof CLEAR_USER;
};

export type UserActions = SetUserAction | ClearUserAction;
