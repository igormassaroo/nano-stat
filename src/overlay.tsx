/**
 * 游戏内监控悬浮窗口入口
 * 独立的轻量级监控面板
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { OverlayPanel } from './components/OverlayPanel';
import { I18nProvider } from './i18n/useI18n';
import './styles/overlay.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <I18nProvider>
      <OverlayPanel />
    </I18nProvider>
  </React.StrictMode>,
);
