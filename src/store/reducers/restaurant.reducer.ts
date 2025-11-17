import {
  CLEAR_RESTAURANT_PAGINATION,
  CLOSE_RESTAURANT_FORM_MODAL,
  OPEN_RESTAURANT_FORM_MODAL,
  SET_RESTAURANT_NEXT_TOKEN,
} from "../actions/restaurant.actions.const";
import type { RestaurantAction } from "../actions/restaurant.actions.type";
import type { RestaurantState } from "./restaurant.type";

const initialState: RestaurantState = {
  nextPageToken: null,
  isRestaurantFormModalOpen: false,
};

export const restaurantReducer = (
  state: RestaurantState = initialState,
  action: RestaurantAction,
): RestaurantState => {
  switch (action.type) {
    case SET_RESTAURANT_NEXT_TOKEN:
      return {
        ...state,
        nextPageToken: action.payload ?? null,
      };
    case CLEAR_RESTAURANT_PAGINATION:
      return initialState;
    case OPEN_RESTAURANT_FORM_MODAL:
      return {
        ...state,
        isRestaurantFormModalOpen: true,
      };
    case CLOSE_RESTAURANT_FORM_MODAL:
      return {
        ...state,
        isRestaurantFormModalOpen: false,
      };
    default:
      return state;
  }
};
