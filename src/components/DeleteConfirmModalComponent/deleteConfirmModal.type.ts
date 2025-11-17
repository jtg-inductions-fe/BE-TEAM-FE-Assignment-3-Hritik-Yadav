export interface DeleteConfirmModalProps {
  title: string,
  open: boolean;
  restaurantName?: string;
  itemName?: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
}
