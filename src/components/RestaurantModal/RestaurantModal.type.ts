import { Restaurant, RestaurantPayLoad } from "@services/restaurant.type";

export interface RestaurantFormModalProps {
  open: boolean;
  mode: "create" | "update";
  initial?: Partial<Restaurant>;
  onCancel: () => void;
  onSubmit: (values: RestaurantPayLoad) => Promise<void> | void;
}

export interface DeleteConfirmModalProps {
  open: boolean;
  restaurant?: Restaurant | null;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
}