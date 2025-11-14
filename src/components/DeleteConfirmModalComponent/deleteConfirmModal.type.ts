import { Restaurant } from "@services/restaurant.type";

export interface DeleteConfirmModalProps {
  open: boolean;
  restaurant?: Restaurant | null;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
}