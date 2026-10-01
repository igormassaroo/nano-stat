/**
 * 设置弹窗组件 / Componente de Configurações
 * 提供游戏内监控的配置选项 / Opções de configuração do monitor em jogo
 */

import { useState, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Monitor, Settings2, Eye, Sun, Moon, Laptop, Globe, Keyboard } from 'lucide-react';
import type { MonitorSettings, MonitorPosition, DisplayItems } from '../types/hardware';
import { showOverlayWindow, hideOverlayWindow, updateOverlayPosition, updateMonitorSettings } from '../api/hardware';
import { useTheme, type ThemeMode } from '../hooks/useTheme';
import { Checkbox } from './ui/Checkbox';
import { useI18n } from '../i18n/useI18n';
import type { Language } from '../i18n/translations';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: MonitorSettings;
  onSave: (settings: MonitorSettings) => void;
}

const overlayMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.18 },
};

const contentMotion = {
  initial: { opacity: 0, scale: 0.95, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 12 },
  transition: { duration: 0.2, ease: 'easeOut' as const },
};

export function SettingsDialog({ open, onOpenChange, settings, onSave }: SettingsDialogProps) {
  const { t, language, setLanguage } = useI18n();
  const [localSettings, setLocalSettings] = useState<MonitorSettings>(settings);
  const { theme, setTheme } = useTheme();
  const settingsRef = useRef(localSettings);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    setLocalSettings(settings);
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      updateMonitorSettings({ ...localSettings, language }).catch(err => {
        console.error('Failed to sync settings:', err);
      });
    }, 150);
    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [localSettings, language]);

  const updateLocalSettings = (next: MonitorSettings) => {
    setLocalSettings(next);
    settingsRef.current = next;
  };

  const handleEnabledChange = async (enabled: boolean) => {
    const next = { ...settingsRef.current, enabled };
    updateLocalSettings(next);
    try {
      if (enabled) {
        await showOverlayWindow();
      } else {
        await hideOverlayWindow();
      }
    } catch (err) {
      console.error('Failed to toggle overlay:', err);
    }
  };

  const handlePositionChange = async (position: MonitorPosition) => {
    const next = { ...settingsRef.current, position };
    updateLocalSettings(next);
    try {
      await updateOverlayPosition(position);
    } catch (err) {
      console.error('Failed to update overlay position:', err);
    }
  };

  const handleDisplayItemChange = (key: keyof DisplayItems, value: boolean) => {
    updateLocalSettings({
      ...settingsRef.current,
      display_items: { ...settingsRef.current.display_items, [key]: value },
    });
  };

  const handleRefreshIntervalChange = (interval: number) => {
    updateLocalSettings({ ...settingsRef.current, refresh_interval: interval });
  };

  const handleOpacityChange = (opacity: number) => {
    updateLocalSettings({ ...settingsRef.current, opacity });
  };

  const handleFontSizeChange = (fontSize: number) => {
    updateLocalSettings({ ...settingsRef.current, font_size: fontSize });
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    updateLocalSettings({ ...settingsRef.current, language: lang });
  };

  const handleSave = async () => {
    const finalSettings = { ...localSettings, language };
    onSave(finalSettings);

    if (finalSettings.enabled) {
      try {
        await showOverlayWindow();
      } catch (err) {
        console.error('Failed to show overlay:', err);
      }
    } else {
      try {
        await hideOverlayWindow();
      } catch (err) {
        console.error('Failed to hide overlay:', err);
      }
    }

    onOpenChange(false);
  };

  const positionOptions: { value: MonitorPosition; label: string }[] = [
    { value: 'TopLeft', label: t('pos_TopLeft') },
    { value: 'TopCenter', label: t('pos_TopCenter') },
    { value: 'TopRight', label: t('pos_TopRight') },
    { value: 'LeftCenter', label: t('pos_LeftCenter') },
    { value: 'RightCenter', label: t('pos_RightCenter') },
    { value: 'BottomLeft', label: t('pos_BottomLeft') },
    { value: 'BottomCenter', label: t('pos_BottomCenter') },
    { value: 'BottomRight', label: t('pos_BottomRight') },
  ];

  const refreshIntervalOptions = [
    { value: 500, label: '500ms' },
    { value: 1000, label: '1s' },
    { value: 2000, label: '2s' },
    { value: 5000, label: '5s' },
  ];

  const themeOptions: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
    { value: 'dark', label: t('theme_dark'), icon: Moon },
    { value: 'light', label: t('theme_light'), icon: Sun },
    { value: 'system', label: t('theme_system'), icon: Laptop },
  ];

  const languageOptions: { value: Language; label: string }[] = [
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'en', label: 'English' },
    { value: 'zh', label: '中文 (简体)' },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay forceMount asChild>
              <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" {...overlayMotion} />
            </Dialog.Overlay>

            <Dialog.Content forceMount asChild>
              <motion.div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[52vw] min-w-[560px] max-w-[900px] max-h-[88vh] rounded-xl shadow-2xl z-50 overflow-hidden bg-[var(--color-bg-card)] border border-[var(--color-border)]"
                {...contentMotion}
              >
                {/* 标题栏 */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg-sidebar)]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Settings2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <Dialog.Title className="text-base font-semibold text-[var(--color-text-primary)]">
                      {t('settings_dialog_title')}
                    </Dialog.Title>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--color-bg-input)] text-[var(--color-text-secondary)]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* 设置内容 */}
                <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[64vh]">
                  {/* Idioma / Language */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">{t('language')}</p>
                    </div>
                    <div className="flex gap-2.5">
                      {languageOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleLanguageChange(option.value)}
                          className={`flex-1 rounded-lg font-medium transition-all px-3 py-2.5 text-xs ${
                            language === option.value
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold'
                              : 'bg-[var(--color-bg-input)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-border-light)] hover:text-[var(--color-text-primary)]'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Atalho Global Hotkey */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <Keyboard className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[var(--color-text-primary)]">{t('hotkey_title')}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-black shadow-sm">
                            Shift + F12
                          </span>
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t('hotkey_desc')}</p>
                      </div>
                    </div>
                  </div>

                  {/* 游戏内监控开关 */}
                  <div className="flex items-center justify-between rounded-lg p-4 bg-[var(--color-bg-input)] border border-[var(--color-border)]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <Monitor className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">{t('overlay_toggle_title')}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{t('overlay_toggle_desc')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEnabledChange(!localSettings.enabled)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        localSettings.enabled
                          ? 'bg-emerald-500 shadow-[0_0_8px_var(--color-card-glow)]'
                          : 'bg-gray-600 shadow-none'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${
                          localSettings.enabled ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 监控面板位置 */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">{t('panel_position')}</p>
                    </div>
                    <div className="grid grid-cols-4 gap-2.5">
                      {positionOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => handlePositionChange(option.value)}
                          className={`rounded-lg font-medium transition-all px-2 py-2.5 text-xs ${
                            localSettings.position === option.value
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-[var(--color-bg-input)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-border-light)] hover:text-[var(--color-text-primary)]'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 显示项目 */}
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)] mb-3">{t('display_items')}</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { key: 'fps' as const, label: t('item_fps') },
                        { key: 'frame_time' as const, label: t('item_frame_time') },
                        { key: 'fps_1pct' as const, label: t('item_fps_1pct') },
                        { key: 'cpu' as const, label: t('item_cpu') },
                        { key: 'cpu_temp' as const, label: t('item_cpu_temp') },
                        { key: 'gpu' as const, label: t('item_gpu') },
                        { key: 'gpu_temp' as const, label: t('item_gpu_temp') },
                        { key: 'memory' as const, label: t('item_memory') },
                        { key: 'vram' as const, label: t('item_vram') },
                        { key: 'network' as const, label: t('item_network') },
                        { key: 'disk' as const, label: t('item_disk') },
                        { key: 'cpu_freq' as const, label: t('item_cpu_freq') },
                        { key: 'gpu_freq' as const, label: t('item_gpu_freq') },
                        { key: 'gpu_power' as const, label: t('item_gpu_power') },
                      ].map(item => (
                        <div
                          key={item.key}
                          className="flex items-center rounded-lg transition-colors border px-3.5 py-2.5 bg-[var(--color-bg-input)] border-[var(--color-border)]"
                        >
                          <Checkbox
                            checked={localSettings.display_items[item.key] ?? false}
                            onChange={value => handleDisplayItemChange(item.key, value)}
                            label={item.label}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 刷新间隔 */}
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)] mb-3">{t('refresh_interval')}</p>
                    <div className="flex gap-2.5">
                      {refreshIntervalOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleRefreshIntervalChange(option.value)}
                          className={`flex-1 rounded-lg font-medium transition-all px-4 py-2.5 text-[13px] ${
                            localSettings.refresh_interval === option.value
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-[var(--color-bg-input)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-border-light)] hover:text-[var(--color-text-primary)]'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 背景透明度 */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">{t('bg_opacity')}</p>
                      <span className="text-sm font-semibold text-[#10b981]">{localSettings.opacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={localSettings.opacity}
                      onChange={e => handleOpacityChange(Number(e.target.value))}
                      className="w-full h-2 bg-[var(--color-bg-input)] rounded-lg appearance-none cursor-pointer accent-emerald-500 border border-[var(--color-border)]"
                    />
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5">
                      {t('bg_opacity_desc')}
                    </p>
                  </div>

                  {/* 文字大小 */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">{t('font_size')}</p>
                      <span className="text-sm font-semibold text-[#10b981]">{localSettings.font_size}px</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={20}
                      value={localSettings.font_size}
                      onChange={e => handleFontSizeChange(Number(e.target.value))}
                      className="w-full h-2 bg-[var(--color-bg-input)] rounded-lg appearance-none cursor-pointer accent-emerald-500 border border-[var(--color-border)]"
                    />
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5">
                      {t('font_size_desc')}
                    </p>
                  </div>

                  {/* 主题切换 */}
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)] mb-3">{t('theme')}</p>
                    <div className="flex gap-2.5">
                      {themeOptions.map(option => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => setTheme(option.value)}
                            className={`flex-1 flex items-center justify-center gap-2 rounded-lg font-medium transition-all px-4 py-2.5 text-[13px] ${
                              theme === option.value
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-[var(--color-bg-input)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-border-light)] hover:text-[var(--color-text-primary)]'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 底部按钮 */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-bg-sidebar)]">
                  <button
                    onClick={() => onOpenChange(false)}
                    className="px-5 py-2.5 text-[13px] font-medium text-[var(--color-text-secondary)] bg-transparent border border-[var(--color-border)] rounded-lg cursor-pointer transition-all hover:text-[var(--color-text-primary)]"
                  >
                    {t('close')}
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 text-[13px] font-semibold text-white bg-[#10b981] border-none rounded-lg cursor-pointer transition-all hover:bg-[#0da271]"
                  >
                    {t('save_settings')}
                  </button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
