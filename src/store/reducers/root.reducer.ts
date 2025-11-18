import { combineReducers } from "redux";

import { menuItemReducer } from "./menuItem.reducer";
import { restaurantReducer } from "./restaurant.reducer";
import { cartReducer } from "./cart.reducer";

export const rootReducer = combineReducers({
  menuItem: menuItemReducer,
  restaurant: restaurantReducer,
  cart: cartReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
