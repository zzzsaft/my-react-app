import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { App as AntdApp } from "antd";
import "antd/dist/reset.css";
import "@ant-design/v5-patch-for-react-19";
import "antd/dist/reset.css"; // Ant Design v5 的全局样式重置

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <AntdApp>
    <App />
  </AntdApp>

  // </StrictMode>,
);
