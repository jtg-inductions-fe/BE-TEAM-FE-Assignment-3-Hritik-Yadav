import type { UploadFile } from "antd/es/upload/interface";

import { MENU_ITEM_CREATE_DEFAULTS } from "./MenuItemFormModal.const";
import type { MenuItem, MenuItemFormValues } from "@services/menu.type";

export const getMenuItemFormInitialValues = (initial?: Partial<MenuItem>): MenuItemFormValues => ({
  name: initial?.name ?? MENU_ITEM_CREATE_DEFAULTS.name,
  description: initial?.description ?? MENU_ITEM_CREATE_DEFAULTS.description,
  amount: {
    currency: initial?.amount?.currency ?? MENU_ITEM_CREATE_DEFAULTS.amount.currency,
    price: initial?.amount?.price ?? MENU_ITEM_CREATE_DEFAULTS.amount.price,
  },
  rating: initial?.rating ?? MENU_ITEM_CREATE_DEFAULTS.rating,
  category: initial?.category ?? MENU_ITEM_CREATE_DEFAULTS.category,
  quantity: initial?.quantity ?? MENU_ITEM_CREATE_DEFAULTS.quantity,
});

export const getUploadProps = (
  fileList: UploadFile[],
  setFileList: (next: UploadFile[]) => void,
) => ({
  beforeUpload: () => false,
  onChange: (info: { fileList: UploadFile[] }) => {
    setFileList(info.fileList.slice(-1));
  },
  maxCount: 1,
  fileList,
  accept: "image/*",
  onRemove: () => {
    setFileList([]);
  },
});
