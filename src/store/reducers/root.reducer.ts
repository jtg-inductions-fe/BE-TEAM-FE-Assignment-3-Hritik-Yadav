import { combineReducers } from "redux";

import { menuItemReducer } from "./menuItem.reducer";
import { restaurantReducer } from "./restaurant.reducer";

export const rootReducer = combineReducers({
  menuItem: menuItemReducer,
  restaurant: restaurantReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
