import { RESTAURANT_MODAL_TIME_FORMAT } from "@components/RestaurantFormModalComponent/RestaurantFormModal.const";

import type { RestaurantFormValues, RestaurantPayload } from "@services/restaurant.type";

export const mapFormValuesToPayload = (values: RestaurantFormValues): RestaurantPayload => ({
  name: values.name,
  openingTime: values.openingTime.format(RESTAURANT_MODAL_TIME_FORMAT),
  closingTime: values.closingTime.format(RESTAURANT_MODAL_TIME_FORMAT),
  status: values.status,
});
