import { combineReducers } from "redux";

import { userReducer } from "./user.reducer";
import { restaurantPaginationReducer } from "./restaurant.reducer";

export const rootReducer = combineReducers({
  user: userReducer,
  restaurantPagination: restaurantPaginationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
