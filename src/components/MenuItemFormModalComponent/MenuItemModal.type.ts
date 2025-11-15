import type { FormikHelpers } from "formik";
import type { MenuItem, MenuItemFormValues } from "@/services/menu.type";

export interface MenuItemFormModalProps {
  open: boolean;
  mode: "create" | "update";
  initial?: Partial<MenuItem>;
  onCancel: () => void;
  onSubmit: (
    values: MenuItemFormValues,
    helpers: FormikHelpers<MenuItemFormValues>,
    file?: File,
  ) => Promise<void> | void;
  showUpload?: boolean;
}
