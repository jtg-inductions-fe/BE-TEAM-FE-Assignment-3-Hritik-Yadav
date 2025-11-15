import { Currency, MenuItemFormValues } from "@services/menu.type";

export const MENU_ITEM_CURRENCY_OPTIONS: Currency[] = ["INR", "USD", "EUR", "JPY"];

export const MENU_ITEM_CREATE_DEFAULTS: MenuItemFormValues = {
  name: "",
  description: "",
  amount: {
    currency: MENU_ITEM_CURRENCY_OPTIONS[0],
    price: 0,
  },
  rating: 5,
  category: "VEG",
  quantity: 10,
};
