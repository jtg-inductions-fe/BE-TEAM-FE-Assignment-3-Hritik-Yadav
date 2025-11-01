import { combineReducers } from "redux";

import { userReducer } from "./user.reducer";
import { restaurantPaginationReducer } from "./restaurant.reducer";
import { modalReducer } from "./modal.reducer";

export const rootReducer = combineReducers({
  user: userReducer,
  restaurantPagination: restaurantPaginationReducer,
  modal: modalReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
