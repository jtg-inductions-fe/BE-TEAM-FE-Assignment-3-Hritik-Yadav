import { MenuItem, MenuItemPayload } from "@/services/menu.type";

export interface MenuItemFormModalProps {
  open: boolean;
  mode: "create" | "update";
  initial?: Partial<MenuItem>;
  onCancel: () => void;
  onSubmit: (values: MenuItemPayload) => Promise<void> | void;
  showUpload?: boolean;
}

export interface DeleteItemConfirmModalProps {
  open: boolean;
  menuItem?: MenuItem | null;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
}
