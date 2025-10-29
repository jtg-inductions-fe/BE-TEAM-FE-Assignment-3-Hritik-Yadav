import React from "react";
import { Spin } from "antd";
import "./loading.style.scss";

export const Loading: React.FC = () => {
  return (
    <div className="loader">
      <Spin size="large" />
    </div>
  );
};
