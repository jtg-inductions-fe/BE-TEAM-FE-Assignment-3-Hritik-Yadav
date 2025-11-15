import type { RootState } from "@/store/reducers/root.reducer";

export const selectRestaurantNextPageToken = (state: RootState) =>
  state.restaurantPagination.nextPageToken;
export const selectIsRestaurantFormModalOpen = (state: RootState) =>
  state.restaurantModal.isRestaurantFormModalOpen;

export const selectMenuItemNextPageToken = (state: RootState) =>
  state.menuItemPagination.nextPageToken;
export const selectIsMenuItemFormModalOpen = (state: RootState) =>
  state.menuItemModal.isMenuItemFormModalOpen;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotalAmount = (state: RootState) => state.cart.totalAmount;
export const selectCartRestaurantId = (state: RootState) => state.cart.restaurantId;
