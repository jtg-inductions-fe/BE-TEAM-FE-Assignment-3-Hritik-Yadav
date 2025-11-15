import { combineReducers } from "redux";

import { menuItemModalReducer } from "./menuItemModal.reducer";
import { menuItemPaginationReducer } from "./menuItem.reducer";
import { restaurantModalReducer } from "./restaurantModal.reducer";
import { restaurantPaginationReducer } from "./restaurant.reducer";
import { cartReducer } from "./cart.reducer";

export const rootReducer = combineReducers({
  restaurantPagination: restaurantPaginationReducer,
  restaurantModal: restaurantModalReducer,
  menuItemModal: menuItemModalReducer,
  menuItemPagination: menuItemPaginationReducer,
  cart: cartReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
