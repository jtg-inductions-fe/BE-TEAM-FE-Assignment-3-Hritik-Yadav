import {
  CLEAR_RESTAURANT_PAGINATION,
  SET_RESTAURANT_NEXT_TOKEN,
} from "@store/reducers/restaurant.const";
import { CLEAR_MENU_ITEM_PAGINATION, SET_MENU_ITEM_NEXT_TOKEN } from "../reducers/menuItem.const";
import {
  CLOSE_MENU_ITEM_FORM_MODAL,
  CLOSE_RESTAURANT_FORM_MODAL,
  OPEN_MENU_ITEM_FORM_MODAL,
  OPEN_RESTAURANT_FORM_MODAL,
} from "../reducers/restaurantModal.const";

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

export const setMenuItemNextToken = (token: string | null) => ({
  type: SET_MENU_ITEM_NEXT_TOKEN,
  payload: token,
});

export const clearMenuItemPagination = () => ({
  type: CLEAR_MENU_ITEM_PAGINATION,
});

export const openMenuItemFormModal = () => ({
  type: OPEN_MENU_ITEM_FORM_MODAL,
});

export const closeMenuItemFormModal = () => ({
  type: CLOSE_MENU_ITEM_FORM_MODAL,
});
