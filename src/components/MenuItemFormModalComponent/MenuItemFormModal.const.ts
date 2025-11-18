import type { Currency, ItemCategory, MenuItemFormValues } from "@services/menu.type";

export const MENU_ITEM_CURRENCY_OPTIONS: Currency[] = ["INR", "USD", "EUR", "JPY"];
export const MENU_ITEM_CATEGORY_OPTIONS: ItemCategory[] = ["VEG", "NONVEG"];
export const CREATE_MODE = "create";
export const UPDATE_MODE = "update";
export const MINIMUM_PRICE = 0.1;

export const MENU_ITEM_CREATE_DEFAULTS: MenuItemFormValues = {
  name: "",
  description: "",
  amount: {
    currency: MENU_ITEM_CURRENCY_OPTIONS[0],
    price: 0,
  },
  rating: 5,
  category: MENU_ITEM_CATEGORY_OPTIONS[0],
  quantity: 10,
};
