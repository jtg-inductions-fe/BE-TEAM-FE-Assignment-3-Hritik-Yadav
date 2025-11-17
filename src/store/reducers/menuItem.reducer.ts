import {
  SET_MENU_ITEM_NEXT_TOKEN,
  CLEAR_MENU_ITEM_PAGINATION,
  OPEN_MENU_ITEM_FORM_MODAL,
  CLOSE_MENU_ITEM_FORM_MODAL,
} from "../actions/menuItems.actions.const";

import type { MenuItemState } from "./menuItem.type";
import type { MenuItemAction } from "../actions/menuItems.actions.type";

const initialState: MenuItemState = {
  nextPageToken: null,
  isMenuItemFormModalOpen: false,
};

export const menuItemReducer = (
  state: MenuItemState = initialState,
  action: MenuItemAction,
): MenuItemState => {
  switch (action.type) {
    case SET_MENU_ITEM_NEXT_TOKEN:
      return {
        ...state,
        nextPageToken: action.payload ?? null,
      };
    case CLEAR_MENU_ITEM_PAGINATION:
      return initialState;
    case OPEN_MENU_ITEM_FORM_MODAL:
      return {
        ...state,
        isMenuItemFormModalOpen: true,
      };
    case CLOSE_MENU_ITEM_FORM_MODAL:
      return {
        ...state,
        isMenuItemFormModalOpen: false,
      };
    default:
      return state;
  }
};
