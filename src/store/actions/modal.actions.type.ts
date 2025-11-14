import type {
  CLOSE_RESTAURANT_FORM_MODAL,
  OPEN_RESTAURANT_FORM_MODAL,
} from "../actions/modal.actions.const";

export type RestaurantModalAction =
  | { type: typeof OPEN_RESTAURANT_FORM_MODAL }
  | { type: typeof CLOSE_RESTAURANT_FORM_MODAL };
