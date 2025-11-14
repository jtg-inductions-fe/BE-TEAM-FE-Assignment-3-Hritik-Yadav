import type { FormikHelpers } from "formik";

import { Restaurant, RestaurantFormValues } from "@services/restaurant.type";

export interface RestaurantFormModalProps {
  open: boolean;
  mode: "create" | "update";
  initial?: Partial<Restaurant>;
  onCancel: () => void;
  onSubmit: (
    values: RestaurantFormValues,
    helpers: FormikHelpers<RestaurantFormValues>,
  ) => Promise<void> | void;
}
