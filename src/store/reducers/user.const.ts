import { UserState } from "./user.type";

export const INITIAL_STATE: UserState = {
  user: null,
};

export const SET_USER = "user/SET_USER" as const;
export const CLEAR_USER = "user/CLEAR_USER" as const;
