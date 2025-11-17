import type { FormikHelpers } from "formik";

import { CREATE_MODE, UPDATE_MODE } from "./MenuItemFormModal.const";
import type { MenuItem, MenuItemFormValues } from "@/services/menu.type";

export interface MenuItemFormModalProps {
  open: boolean;
  mode: typeof CREATE_MODE | typeof UPDATE_MODE;
  initial?: Partial<MenuItem>;
  onCancel: () => void;
  onSubmit: (
    values: MenuItemFormValues,
    helpers: FormikHelpers<MenuItemFormValues>,
    file?: File,
  ) => Promise<void> | void;
  showUpload?: boolean;
}
