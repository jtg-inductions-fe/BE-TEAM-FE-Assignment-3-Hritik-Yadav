import { MenuItemFormValues, MenuItemPayload } from "@services/menu.type";

export const mapUpdateFormValuesToPayload = (
  values: MenuItemFormValues,
  overrides: Partial<MenuItemPayload> = {},
): MenuItemPayload => ({
  name: values.name,
  description: values.description,
  amount: {
    currency: values.amount.currency,
    price: values.amount.price,
  },
  rating: values.rating,
  category: values.category,
  quantity: values.quantity,
  ...overrides,
});