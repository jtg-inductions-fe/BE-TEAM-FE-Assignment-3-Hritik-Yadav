import {
  SET_MENU_ITEM_NEXT_TOKEN,
  CLEAR_MENU_ITEM_PAGINATION,
} from "../actions/menuItems.action.const";
import type { MenuItemPaginationState } from "./menuItem.type";
import type { MenuItemPaginationAction } from "../actions/menuItems.action.type";

const initialState: MenuItemPaginationState = {
  nextPageToken: null,
};

export const menuItemPaginationReducer = (
  state: MenuItemPaginationState = initialState,
  action: MenuItemPaginationAction,
): MenuItemPaginationState => {
  switch (action.type) {
    case SET_MENU_ITEM_NEXT_TOKEN:
      return {
        ...state,
        nextPageToken: action.payload ?? null,
      };
    case CLEAR_MENU_ITEM_PAGINATION:
      return initialState;
    default:
      return state;
  }
};
