import * as Yup from "yup";

import type { RestaurantStatus } from "@services/restaurant.type";

const STATUS_OPTIONS: RestaurantStatus[] = ["active", "inactive"];

export const restaurantFormValidationSchema = Yup.object().shape({
  name: Yup.string().min(2).max(100).required("Name is required"),
  openingTime: Yup.mixed().required("Opening time is required"),
  closingTime: Yup.mixed().required("Closing time is required"),
  status: Yup.mixed<RestaurantStatus>().oneOf(STATUS_OPTIONS).required("Status is required"),
});
