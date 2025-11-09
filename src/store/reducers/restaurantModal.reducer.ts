import {
  OPEN_RESTAURANT_FORM_MODAL,
  CLOSE_RESTAURANT_FORM_MODAL,
} from "../actions/modal.actions.const";
import type { RestaurantModalState } from "./restaurantModal.type";
import type { RestaurantModalAction } from "../actions/modal.action.type";

const initialState: RestaurantModalState = {
  isRestaurantFormModalOpen: false,
};

export const restaurantModalReducer = (
  state: RestaurantModalState = initialState,
  action: RestaurantModalAction,
): RestaurantModalState => {
  switch (action.type) {
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
