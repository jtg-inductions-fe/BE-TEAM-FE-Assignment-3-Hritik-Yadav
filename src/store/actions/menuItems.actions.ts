import {
  CLEAR_MENU_ITEM_PAGINATION,
  CLOSE_MENU_ITEM_FORM_MODAL,
  OPEN_MENU_ITEM_FORM_MODAL,
  SET_MENU_ITEM_NEXT_TOKEN,
} from "./menuItems.actions.const";

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
