import { CLEAR_RESTAURANT_PAGINATION, SET_RESTAURANT_NEXT_TOKEN } from "@store/reducers/restaurant.const";
import { CLEAR_USER, SET_USER } from "@store/reducers/user.const";
import type { UserData } from "@/services/service.type";

export const setUser = (user: UserData | null) => ({
  type: SET_USER,
  payload: user,
});

export const clearUser = () => ({
  type: CLEAR_USER,
});

export const setRestaurantNextToken = (token: string | null) => ({
  type: SET_RESTAURANT_NEXT_TOKEN,
  payload: token,
});

export const clearRestaurantPagination = () => ({
  type: CLEAR_RESTAURANT_PAGINATION,
});
