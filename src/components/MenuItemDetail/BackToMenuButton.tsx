import React from "react";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

export interface BackToMenuButtonProps {
  onClick: () => void;
  label?: string;
}

export const BackToMenuButton: React.FC<BackToMenuButtonProps> = ({
  onClick,
  label = "Back to menu",
}) => {
  return (
    <Button type="link" icon={<ArrowLeftOutlined />} onClick={onClick}>
      {label}
    </Button>
  );
};
