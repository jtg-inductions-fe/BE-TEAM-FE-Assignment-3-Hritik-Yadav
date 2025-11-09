import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Modal } from "antd";

import type { DeleteConfirmModalProps } from "./RestaurantModal.type";
import "./restaurantModal.style.scss";

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
      title={
        <div className="delete-confirm-modal__header">
          <span className="delete-confirm-modal__title">Delete Restaurant</span>
          <button
            type="button"
            onClick={onCancel}
            className="delete-confirm-modal__close-button"
            aria-label="Close"
          >
            <CloseOutlined aria-hidden />
          </button>
        </div>
      }
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Delete"
      okButtonProps={{ danger: true, loading, className: "delete-confirm-modal__delete-button" }}
      className="delete-confirm-modal"
      closable={false}
      destroyOnClose
    >
      Are you sure you want to delete {restaurant?.name}? This action cannot be undone.
    </Modal>
  );
};
