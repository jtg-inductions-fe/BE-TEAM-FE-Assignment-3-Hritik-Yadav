import React from "react";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import type { BackToMenuButtonProps } from "./backToButton.type";

import "./backToButton.style.scss";

export const BackToButton: React.FC<BackToMenuButtonProps> = ({ label = "Go Back" }) => {
  const navigate = useNavigate();
  const onBack = () => navigate(-1);

  return (
    <Button
      type="link"
      icon={<ArrowLeftOutlined />}
      onClick={onBack}
      className="back-to-button__trigger"
    >
      {label}
    </Button>
  );
};
