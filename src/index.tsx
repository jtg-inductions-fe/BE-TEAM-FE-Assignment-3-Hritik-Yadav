import React from "react";
import { ConfigProvider } from "antd";
import ReactDOM from "react-dom/client";

import { App } from "@/App";

import "./index.scss";
import "antd/dist/antd.variable.min.css";

ConfigProvider.config({
  theme: {
    primaryColor: "#1890ff",
    infoColor: "#1890ff",
    successColor: "#52c41a",
    processingColor: "#1890ff",
    errorColor: "#f5222d",
    warningColor: "#faad14",
  },
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found. Ensure your HTML has a <div id='root'></div>");
}
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
