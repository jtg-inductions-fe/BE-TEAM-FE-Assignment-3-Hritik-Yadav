import React from "react";
import { Spin } from "antd";

import "./appLoader.style.scss";

export const AppLoader: React.FC = () => {
  return (
    <div className="loader">
      <Spin size="large" />
    </div>
  );
};
