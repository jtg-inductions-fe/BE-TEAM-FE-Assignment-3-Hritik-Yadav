import { CLEAR_USER, SET_USER } from "./actions.const";
import type { UserData } from "@services/service.type";

export type SetUserAction = {
  type: typeof SET_USER;
  payload: UserData | null;
};

export type ClearUserAction = {
  type: typeof CLEAR_USER;
};

export type UserActions = SetUserAction | ClearUserAction;
