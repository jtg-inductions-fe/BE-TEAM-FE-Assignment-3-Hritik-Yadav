import React from "react";
import { Modal } from "antd";
import { DeleteItemConfirmModalProps } from "./MenuItemModal.type";

export const DeleteItemConfirmModal: React.FC<DeleteItemConfirmModalProps> = ({
  open,
  menuItem,
  onCancel,
  onConfirm,
  loading,
}) => {
  return (
    <Modal
      open={open}
      title="Delete Item"
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Delete"
      okButtonProps={{ danger: true, loading }}
      destroyOnClose
    >
      Are you sure you want to delete {menuItem?.name}? This action cannot be undone.
    </Modal>
  );
};
