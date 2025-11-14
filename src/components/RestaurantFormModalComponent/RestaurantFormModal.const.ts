import type { RestaurantPayload } from "@services/restaurant.type";

export const RESTAURANT_MODAL_TIME_FORMAT = "HH:mm";

export const RESTAURANT_CREATE_DEFAULTS: RestaurantPayload = {
  name: "",
  openingTime: "08:00",
  closingTime: "22:00",
  status: "active",
};
