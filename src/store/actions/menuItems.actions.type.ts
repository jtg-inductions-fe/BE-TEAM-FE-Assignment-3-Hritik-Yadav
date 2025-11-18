import {
  SET_MENU_ITEM_NEXT_TOKEN,
  CLEAR_MENU_ITEM_PAGINATION,
  OPEN_MENU_ITEM_FORM_MODAL,
  CLOSE_MENU_ITEM_FORM_MODAL,
} from "./menuItems.actions.const";

export type MenuItemAction =
  | {
      type: typeof SET_MENU_ITEM_NEXT_TOKEN;
      payload: string | null;
    }
  | { type: typeof CLEAR_MENU_ITEM_PAGINATION }
  | { type: typeof OPEN_MENU_ITEM_FORM_MODAL }
  | { type: typeof CLOSE_MENU_ITEM_FORM_MODAL };
