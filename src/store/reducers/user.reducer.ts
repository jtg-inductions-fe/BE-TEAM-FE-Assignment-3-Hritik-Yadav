import { CLEAR_USER, SET_USER } from "../actions/actions.const";
import { INITIAL_STATE } from "./user.const";
import type { SetUserAction, UserActions } from "../actions/actions.type";
import type { UserState } from "./user.type";

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
