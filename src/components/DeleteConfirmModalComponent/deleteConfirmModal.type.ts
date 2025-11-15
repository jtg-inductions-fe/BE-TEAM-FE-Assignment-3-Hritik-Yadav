import type { MenuItem } from "@services/menu.type";
import type { Restaurant } from "@services/restaurant.type";

export interface DeleteConfirmModalProps {
  open: boolean;
  restaurant?: Restaurant | null;
  menuItem?: MenuItem | null;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
}
