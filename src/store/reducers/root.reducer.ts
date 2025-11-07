import { combineReducers } from "redux";

import { restaurantPaginationReducer } from "./restaurant.reducer";
import { modalReducer } from "./modal.reducer";

export const rootReducer = combineReducers({
  restaurantPagination: restaurantPaginationReducer,
  modal: modalReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
