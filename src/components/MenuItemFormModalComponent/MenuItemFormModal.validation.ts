import * as Yup from "yup";

import { MENU_ITEM_CURRENCY_OPTIONS } from "./MenuItemFormModal.const";

export const menuItemFormValidationSchema = Yup.object({
  name: Yup.string()
    .required("Item name is required")
    .max(50, "Name should not exceed 50 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description should be greater than 15 characters")
    .max(300, "Description should not exceed 300 characters"),
  amount: Yup.object({
    currency: Yup.string().oneOf(MENU_ITEM_CURRENCY_OPTIONS, "Invalid currency"),
    price: Yup.number().min(0.1, "Price must be added and positive").required("Price is required"),
  }),
  category: Yup.string().oneOf(["VEG", "NONVEG"], "Select a valid catrgory"),
  quantity: Yup.number()
    .required("Quantity is required")
    .min(0, "Quantity cannot be negative")
    .max(1000, "Quantity can not be greater than 1000"),
  rating: Yup.number().min(0).max(5).notRequired(),
});
