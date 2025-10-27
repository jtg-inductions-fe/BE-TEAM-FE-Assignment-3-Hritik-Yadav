import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/antd.css";

import App from "@/App";

import "./index.scss";

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
