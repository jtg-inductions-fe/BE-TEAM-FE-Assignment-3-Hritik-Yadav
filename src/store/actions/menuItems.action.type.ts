import { SET_MENU_ITEM_NEXT_TOKEN, CLEAR_MENU_ITEM_PAGINATION } from "./menuItems.action.const";

interface SetNextTokenAction {
  type: typeof SET_MENU_ITEM_NEXT_TOKEN;
  payload: string | null;
}

interface ClearPaginationAction {
  type: typeof CLEAR_MENU_ITEM_PAGINATION;
}

export type MenuItemPaginationAction = SetNextTokenAction | ClearPaginationAction;
