import type {
  OPEN_RESTAURANT_FORM_MODAL,
  CLOSE_RESTAURANT_FORM_MODAL,
  OPEN_MENU_ITEM_FORM_MODAL,
  CLOSE_MENU_ITEM_FORM_MODAL,
} from "./modal.actions.const";

export type RestaurantModalAction =
  | { type: typeof OPEN_RESTAURANT_FORM_MODAL }
  | { type: typeof CLOSE_RESTAURANT_FORM_MODAL };

export type MenuItemModalAction =
  | { type: typeof OPEN_MENU_ITEM_FORM_MODAL }
  | { type: typeof CLOSE_MENU_ITEM_FORM_MODAL };
