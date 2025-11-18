export interface DeleteConfirmModalProps {
  open: boolean;
  restaurantName: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
}
