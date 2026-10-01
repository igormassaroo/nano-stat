import React from "react";
import ReactDOM from "react-dom/client";
import { emit } from "@tauri-apps/api/event";
import App from "./App";
import { I18nProvider } from "./i18n/useI18n";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>,
);

// 首屏渲染完成（双 rAF 确保首帧已绘制）后通知 Rust 切换 splash → 主窗口
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    emit("main-ready").catch(() => {});
  });
});
