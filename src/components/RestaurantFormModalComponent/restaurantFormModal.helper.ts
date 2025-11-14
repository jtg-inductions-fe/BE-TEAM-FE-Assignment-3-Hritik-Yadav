import moment from "moment";

import { Restaurant, RestaurantFormValues, RestaurantStatus } from "@services/restaurant.type";
import {
  RESTAURANT_CREATE_DEFAULTS,
  RESTAURANT_MODAL_TIME_FORMAT,
} from "./RestaurantFormModal.const";

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
