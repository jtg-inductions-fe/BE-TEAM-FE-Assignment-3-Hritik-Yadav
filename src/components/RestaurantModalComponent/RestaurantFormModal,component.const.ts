import moment from "moment";

import type { Restaurant, RestaurantFormValues, RestaurantStatus } from "@services/restaurant.type";

export const RESTAURANT_MODAL_TIME_FORMAT = "HH:mm";

export const RESTAURANT_CREATE_DEFAULTS: {
  name: string;
  openingTime: string;
  closingTime: string;
  status: RestaurantStatus;
} = {
  name: "",
  openingTime: "08:00",
  closingTime: "22:00",
  status: "active",
};

export const getRestaurantFormInitialValues = (
  initial?: Partial<Restaurant>,
): RestaurantFormValues => ({
  name: initial?.name ?? RESTAURANT_CREATE_DEFAULTS.name,
  openingTime: moment(
    initial?.openingTime ?? RESTAURANT_CREATE_DEFAULTS.openingTime,
    RESTAURANT_MODAL_TIME_FORMAT,
  ),
  closingTime: moment(
    initial?.closingTime ?? RESTAURANT_CREATE_DEFAULTS.closingTime,
    RESTAURANT_MODAL_TIME_FORMAT,
  ),
  status: (initial?.status as RestaurantStatus) ?? RESTAURANT_CREATE_DEFAULTS.status,
});
