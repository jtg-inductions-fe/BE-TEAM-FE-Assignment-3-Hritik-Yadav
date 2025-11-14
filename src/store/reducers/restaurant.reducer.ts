import {
  CLEAR_RESTAURANT_PAGINATION,
  SET_RESTAURANT_NEXT_TOKEN,
} from "../actions/restaurant.actions.const";
import type { RestaurantPaginationAction } from "../actions/restaurant.actions.type";
import type { RestaurantPaginationState } from "./restaurant.type";

const initialState: RestaurantPaginationState = {
  nextPageToken: null,
};

export const restaurantPaginationReducer = (
  state: RestaurantPaginationState = initialState,
  action: RestaurantPaginationAction,
): RestaurantPaginationState => {
  switch (action.type) {
    case SET_RESTAURANT_NEXT_TOKEN:
      return {
        ...state,
        nextPageToken: action.payload ?? null,
      };
    case CLEAR_RESTAURANT_PAGINATION:
      return initialState;
    default:
      return state;
  }
};
