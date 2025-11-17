import {
  CLEAR_RESTAURANT_PAGINATION,
  CLOSE_RESTAURANT_FORM_MODAL,
  OPEN_RESTAURANT_FORM_MODAL,
  SET_RESTAURANT_NEXT_TOKEN,
} from "./restaurant.actions.const";

export type RestaurantAction =
  | { type: typeof SET_RESTAURANT_NEXT_TOKEN; payload: string | null }
  | { type: typeof OPEN_RESTAURANT_FORM_MODAL }
  | { type: typeof CLEAR_RESTAURANT_PAGINATION }
  | { type: typeof CLOSE_RESTAURANT_FORM_MODAL };
