export interface DeleteConfirmModalProps {
  open: boolean;
  restaurantName?: string;
  menuItemName?: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
}
