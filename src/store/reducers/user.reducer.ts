import { CLEAR_USER, INITIAL_STATE, SET_USER } from "./user.const";
import type { SetUserAction, UserActions, UserState } from "./user.type";

export const userReducer = (state: UserState = INITIAL_STATE, action: UserActions): UserState => {
  switch (action.type) {
    case SET_USER: {
      const payload = (action as SetUserAction).payload;
      return { ...state, user: payload };
    }
    case CLEAR_USER:
      return { ...state, user: null };
    default:
      return state;
  }
};
