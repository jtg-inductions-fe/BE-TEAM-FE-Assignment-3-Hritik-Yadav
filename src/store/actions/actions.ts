import {
  CLEAR_RESTAURANT_PAGINATION,
  SET_RESTAURANT_NEXT_TOKEN,
} from "@store/reducers/restaurant.const";
import {
  CLOSE_RESTAURANT_FORM_MODAL,
  OPEN_RESTAURANT_FORM_MODAL,
} from "@store/reducers/modal.const";

export const setRestaurantNextToken = (token: string | null) => ({
  type: SET_RESTAURANT_NEXT_TOKEN,
  payload: token,
});

export const clearRestaurantPagination = () => ({
  type: CLEAR_RESTAURANT_PAGINATION,
});

export const openRestaurantFormModal = () => ({
  type: OPEN_RESTAURANT_FORM_MODAL,
});

export const closeRestaurantFormModal = () => ({
  type: CLOSE_RESTAURANT_FORM_MODAL,
});
