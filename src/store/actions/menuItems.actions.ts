import { CLEAR_MENU_ITEM_PAGINATION, SET_MENU_ITEM_NEXT_TOKEN } from "./menuItems.action.const";

export const setMenuItemNextToken = (token: string | null) => ({
  type: SET_MENU_ITEM_NEXT_TOKEN,
  payload: token,
});

export const clearMenuItemPagination = () => ({
  type: CLEAR_MENU_ITEM_PAGINATION,
});
