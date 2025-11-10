import type { RestaurantStatus } from "@services/restaurant.type";

export const STATUS_TAG_COLOR: Record<RestaurantStatus, string> = {
  active: "green",
  inactive: "red",
};
