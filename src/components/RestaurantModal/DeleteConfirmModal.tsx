import React from "react";
import { Modal } from "antd";
import { DeleteConfirmModalProps } from "./RestaurantModal.type";

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  restaurant,
  onCancel,
  onConfirm,
  loading,
}) => {
  return (
    <Modal
      open={open}
      title="Delete Restaurant"
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Delete"
      okButtonProps={{ danger: true, loading }}
      destroyOnClose
    >
      Are you sure you want to delete {restaurant?.name}? This action cannot be undone.
    </Modal>
  );
};
