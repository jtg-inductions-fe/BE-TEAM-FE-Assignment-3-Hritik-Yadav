import { CLEAR_RESTAURANT_PAGINATION, SET_RESTAURANT_NEXT_TOKEN } from "./restaurant.actions.const";

export const setRestaurantNextToken = (token: string | null) => ({
  type: SET_RESTAURANT_NEXT_TOKEN,
  payload: token,
});

export const clearRestaurantPagination = () => ({
  type: CLEAR_RESTAURANT_PAGINATION,
});
