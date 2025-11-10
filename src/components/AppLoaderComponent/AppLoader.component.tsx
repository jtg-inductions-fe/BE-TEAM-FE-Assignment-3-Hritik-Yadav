import React from "react";
import { Spin } from "antd";

import "./appLoader.component.style.scss";

export const AppLoaderComponent: React.FC = () => {
  return (
    <div className="loader">
      <Spin size="large" />
    </div>
  );
};
