import { combineReducers } from "redux";

import { itemModalReducer } from "./itemModal.reducer";
import { menuItemPaginationReducer } from "./menuItem.reducer";
import { restaurantModalReducer } from "./restaurantModal.reducer";
import { restaurantPaginationReducer } from "./restaurant.reducer";

export const rootReducer = combineReducers({
  restaurantPagination: restaurantPaginationReducer,
  restaurantModal: restaurantModalReducer,
  itemModal: itemModalReducer,
  menuItemPagination: menuItemPaginationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
