import { Amount, Currency, ItemCategory, MenuItem, MenuItemFormValues } from "@/services/menu.type";

export const MENU_ITEM_CURRENCY_OPTIONS: Currency[] = ["INR", "USD", "EUR", "JPY"];

export const MENU_ITEM_CREATE_DEFAULTS: {
  name: string;
  description: string;
  imageName?: string;
  amount: Amount;
  rating: number;
  category: ItemCategory;
  quantity: number;
} = {
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

export const getMenuItemFormInitialValues = (initial?: Partial<MenuItem>): MenuItemFormValues => ({
  name: initial?.name ?? MENU_ITEM_CREATE_DEFAULTS.name,
  description: initial?.description ?? MENU_ITEM_CREATE_DEFAULTS.description,
  amount: {
    currency: initial?.amount?.currency ?? MENU_ITEM_CREATE_DEFAULTS.amount.currency,
    price: initial?.amount?.price ?? MENU_ITEM_CREATE_DEFAULTS.amount.price,
  },
  rating: initial?.rating ?? MENU_ITEM_CREATE_DEFAULTS.rating,
  category: initial?.category ?? MENU_ITEM_CREATE_DEFAULTS.category,
  quantity: initial?.quantity ?? MENU_ITEM_CREATE_DEFAULTS.quantity,
});
