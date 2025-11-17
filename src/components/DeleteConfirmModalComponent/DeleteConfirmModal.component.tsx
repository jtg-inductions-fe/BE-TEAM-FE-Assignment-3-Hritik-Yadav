import React from "react";
import { CloseCircleFilled } from "@ant-design/icons";
import { Modal, Typography } from "antd";

import type { DeleteConfirmModalProps } from "./deleteConfirmModal.type";

import "./deleteConfirmModal.style.scss";

const { Title } = Typography;

export const DeleteConfirmModalComponent: React.FC<DeleteConfirmModalProps> = ({
  open,
  restaurantName,
  menuItemName,
  onCancel,
  onConfirm,
  loading,
}) => {
  return (
    <Modal
      open={open}
      title={
        <Title level={3} className="delete-confirm-modal__title">
          Delete {restaurantName ? "Restaurant" : "Menu Item"}
        </Title>
      }
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Delete"
      okButtonProps={{ danger: true, loading, className: "delete-confirm-modal__delete-button" }}
      className="delete-confirm-modal"
      closeIcon={<CloseCircleFilled />}
      destroyOnClose
    >
      Are you sure you want to delete {restaurantName ?? menuItemName}? This action cannot be
      undone.
    </Modal>
  );
};
