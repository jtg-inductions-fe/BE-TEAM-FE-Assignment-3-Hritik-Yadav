import { combineReducers } from "redux";

import { menuItemModalReducer } from "./menuItemModal.reducer";
import { menuItemPaginationReducer } from "./menuItem.reducer";
import { restaurantModalReducer } from "./restaurantModal.reducer";
import { restaurantPaginationReducer } from "./restaurant.reducer";

export const rootReducer = combineReducers({
  restaurantPagination: restaurantPaginationReducer,
  restaurantModal: restaurantModalReducer,
  menuItemModal: menuItemModalReducer,
  menuItemPagination: menuItemPaginationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
