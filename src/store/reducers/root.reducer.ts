import { combineReducers } from "redux";

import { restaurantPaginationReducer } from "./restaurant.reducer";
import { restaurantModalReducer } from "./restaurantModal.reducer";

export const rootReducer = combineReducers({
  restaurantPagination: restaurantPaginationReducer,
  restaurantModal: restaurantModalReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
