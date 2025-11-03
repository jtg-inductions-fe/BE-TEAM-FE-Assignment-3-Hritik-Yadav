import { UserState } from "./user.type";

export const INITIAL_STATE: UserState = {
  user: null,
};

export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";
