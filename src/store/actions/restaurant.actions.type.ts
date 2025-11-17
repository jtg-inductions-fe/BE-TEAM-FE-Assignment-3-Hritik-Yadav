import {
  CLEAR_RESTAURANT_PAGINATION,
  CLOSE_RESTAURANT_FORM_MODAL,
  OPEN_RESTAURANT_FORM_MODAL,
  SET_RESTAURANT_NEXT_TOKEN,
} from "./restaurant.actions.const";

interface SetNextTokenAction {
  type: typeof SET_RESTAURANT_NEXT_TOKEN;
  payload: string | null;
}

interface ClearPaginationAction {
  type: typeof CLEAR_RESTAURANT_PAGINATION;
}

export type RestaurantPaginationAction = SetNextTokenAction | ClearPaginationAction;

export type RestaurantModalAction =
  | { type: typeof OPEN_RESTAURANT_FORM_MODAL }
  | { type: typeof CLOSE_RESTAURANT_FORM_MODAL };

export type RestaurantAction = RestaurantPaginationAction | RestaurantModalAction;
