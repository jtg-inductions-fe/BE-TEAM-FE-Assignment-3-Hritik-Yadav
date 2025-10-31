import React from "react";
import { ConfigProvider } from "antd";
import ReactDOM from "react-dom/client";

import { App } from "@/App";

import "@/index.scss";
import "antd/dist/antd.variable.min.css";
import { themeConfig } from "@/theme";

ConfigProvider.config({
  theme: themeConfig,
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
