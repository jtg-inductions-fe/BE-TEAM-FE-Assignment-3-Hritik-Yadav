import type { RootState } from "@/store/reducers/root.reducer";

export const selectRestaurantNextPageToken = (state: RootState) => state.restaurant.nextPageToken;
export const selectIsRestaurantFormModalOpen = (state: RootState) =>
  state.restaurant.isRestaurantFormModalOpen;
