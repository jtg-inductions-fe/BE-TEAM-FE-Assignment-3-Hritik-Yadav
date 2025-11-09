import { CLEAR_RESTAURANT_PAGINATION, SET_RESTAURANT_NEXT_TOKEN } from "./restaurant.actions.const";

interface SetNextTokenAction {
  type: typeof SET_RESTAURANT_NEXT_TOKEN;
  payload: string | null;
}

interface ClearPaginationAction {
  type: typeof CLEAR_RESTAURANT_PAGINATION;
}

export type RestaurantPaginationAction = SetNextTokenAction | ClearPaginationAction;
