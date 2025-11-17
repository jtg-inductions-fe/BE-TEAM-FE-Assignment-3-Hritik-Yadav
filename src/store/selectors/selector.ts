import type { RootState } from "@store/reducers/root.reducer";

export const selectRestaurantNextPageToken = (state: RootState) => state.restaurant.nextPageToken;
export const selectIsRestaurantFormModalOpen = (state: RootState) =>
  state.restaurant.isRestaurantFormModalOpen;

export const selectMenuItemNextPageToken = (state: RootState) => state.menuItem.nextPageToken;
export const selectIsMenuItemFormModalOpen = (state: RootState) =>
  state.menuItem.isMenuItemFormModalOpen;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotalAmount = (state: RootState) => state.cart.totalAmount;
export const selectCartRestaurantId = (state: RootState) => state.cart.restaurantId;
