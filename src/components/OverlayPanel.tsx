/**
 * 游戏内监控悬浮面板组件
 * Painel de monitoramento de desempenho em tempo real
 */

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import type { RealtimeStats, MonitorSettings } from '../types/hardware';
import { formatSpeed, formatGb, formatDiskRate } from '../utils/format';
import { useI18n } from '../i18n/useI18n';

/** 默认设置 (PT-BR) */
const defaultSettings: MonitorSettings = {
  enabled: true,
  position: 'TopCenter',
  display_items: {
    cpu: true,
    cpu_temp: true,
    gpu: true,
    gpu_temp: true,
    memory: true,
    network: false,
    fps: true,
    frame_time: true,
    fps_1pct: true,
    vram: true,
    disk: false,
    cpu_freq: false,
    gpu_freq: false,
    gpu_power: false,
  },
  refresh_interval: 1000,
  opacity: 80,
  font_size: 13,
  language: 'pt-BR',
  hotkey: 'Shift+F12',
};

export function OverlayPanel() {
  const { t, setLanguage } = useI18n();
  const [stats, setStats] = useState<RealtimeStats | null>(null);
  const [settings, setSettings] = useState<MonitorSettings>(defaultSettings);

  // 加载设置并监听设置变更事件
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await invoke<MonitorSettings>('get_monitor_settings');
        setSettings(data);
        if (data.language) {
          setLanguage(data.language as any);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };
    loadSettings();
    
    // 监听主窗口设置变更事件，实时响应
    const unlistenPromise = listen<MonitorSettings>('settings-changed', (event) => {
      setSettings(event.payload);
      if (event.payload.language) {
        setLanguage(event.payload.language as any);
      }
    });
    return () => {
      unlistenPromise.then(unlisten => unlisten()).catch(() => {});
    };
  }, [setLanguage]);

  // 定时获取实时数据
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await invoke<RealtimeStats>('get_realtime_stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, settings.refresh_interval);
    return () => clearInterval(interval);
  }, [settings.refresh_interval]);

  // 判断是否为垂直布局（仅左右居中位置；四角使用水平紧凑条）
  const isVertical = settings.position === 'LeftCenter' || settings.position === 'RightCenter';

  const panelStyle = {
    '--panel-bg-alpha': settings.opacity / 100,
    '--panel-font-size': `${settings.font_size}px`,
  } as CSSProperties;

  return (
    <div
      className={`overlay-panel ${isVertical ? 'overlay-vertical' : 'overlay-horizontal'}`}
      style={panelStyle}
    >
      {/* FPS */}
      {settings.display_items.fps && (
        <div className="monitor-item">
          <span className="monitor-label">{t('overlay_fps')}</span>
          <span className="monitor-value text-fps">
            {stats?.fps != null ? stats.fps.toFixed(0) : '--'}
          </span>
        </div>
      )}

      {/* Frametime (ms) */}
      {settings.display_items.frame_time && (
        <div className="monitor-item">
          <span className="monitor-label">{t('overlay_frame_time')}</span>
          <span className="monitor-value text-fps">
            {stats?.frame_time != null ? `${stats.frame_time.toFixed(1)}ms` : '--'}
          </span>
        </div>
      )}

      {/* 1% Low FPS */}
      {settings.display_items.fps_1pct && (
        <div className="monitor-item">
          <span className="monitor-label">{t('overlay_fps_1pct')}</span>
          <span className="monitor-value text-fps">
            {stats?.fps_1pct != null ? stats.fps_1pct.toFixed(0) : '--'}
          </span>
        </div>
      )}

      {/* CPU 使用率 */}
      {settings.display_items.cpu && (
        <div className="monitor-item">
          <span className="monitor-label">{t('overlay_cpu')}</span>
          <span className="monitor-value text-cpu">
            {stats?.cpu_usage.toFixed(0) ?? '--'}%
          </span>
        </div>
      )}

      {/* CPU 温度 */}
      {settings.display_items.cpu_temp && (
        <div className="monitor-item">
          <span className="monitor-label">{t('overlay_cpu_temp')}</span>
          <span className="monitor-value text-temp">
            {stats?.cpu_temp?.toFixed(0) ?? '--'}°C
          </span>
        </div>
      )}

      {/* 内存 RAM 使用率 + 已用容量 */}
      {settings.display_items.memory && (
        <div className="monitor-item">
          <span className="monitor-label">{t('overlay_memory')}</span>
          <span className="monitor-value text-memory">
            {stats?.memory_usage.toFixed(0) ?? '--'}%{' '}
            {stats ? `${formatGb(stats.memory_used)}/${formatGb(stats.memory_total)}` : ''}
          </span>
        </div>
      )}

      {/* GPU 使用率 */}
      {settings.display_items.gpu && (
        <div className="monitor-item">
          <span className="monitor-label">{t('overlay_gpu')}</span>
          <span className="monitor-value text-gpu">
            {stats?.gpu_usage.toFixed(0) ?? '--'}%
          </span>
        </div>
      )}

      {/* GPU 温度 */}
      {settings.display_items.gpu_temp && (
        <div className="monitor-item">
          <span className="monitor-label">{t('overlay_gpu_temp')}</span>
          <span className="monitor-value text-temp">
            {stats?.gpu_temp?.toFixed(0) ?? '--'}°C
          </span>
        </div>
      )}

      {/* 显存 VRAM */}
      {settings.display_items.vram && (
        <div className="monitor-item">
          <span className="monitor-label">{t('overlay_vram')}</span>
          <span className="monitor-value text-gpu">
            {stats?.vram_used != null && stats?.vram_total != null
              ? `${formatGb(stats.vram_used)}/${formatGb(stats.vram_total)}`
              : '--'}
          </span>
        </div>
      )}

      {/* 网络速率 */}
      {settings.display_items.network && (
        <div className="monitor-item">
          <span className="monitor-label">{t('overlay_network')}</span>
          <span className="monitor-value text-network">
            ↓{formatSpeed(stats?.network_stats.download_rate ?? 0)}
          </span>
        </div>
      )}

      {/* 磁盘读写速率 */}
      {settings.display_items.disk && (
        <div className="monitor-item">
          <span className="monitor-label">{t('overlay_disk')}</span>
          <span className="monitor-value text-network">
            ↓{stats?.disk_read_rate != null ? formatDiskRate(stats.disk_read_rate) : '--'}{' '}
            ↑{stats?.disk_write_rate != null ? formatDiskRate(stats.disk_write_rate) : '--'}
          </span>
        </div>
      )}

      {/* CPU 当前频率 */}
      {settings.display_items.cpu_freq && (
        <div className="monitor-item">
          <span className="monitor-label">{t('overlay_cpu_freq')}</span>
          <span className="monitor-value text-cpu">
            {stats?.cpu_frequency != null ? `${(stats.cpu_frequency / 1000).toFixed(2)}G` : '--'}
          </span>
        </div>
      )}

      {/* GPU 核心频率 */}
      {settings.display_items.gpu_freq && (
        <div className="monitor-item">
          <span className="monitor-label">{t('overlay_gpu_freq')}</span>
          <span className="monitor-value text-gpu">
            {stats?.gpu_clock != null ? `${(stats.gpu_clock / 1000).toFixed(2)}G` : '--'}
          </span>
        </div>
      )}

      {/* GPU 功耗 */}
      {settings.display_items.gpu_power && (
        <div className="monitor-item">
          <span className="monitor-label">{t('overlay_gpu_power')}</span>
          <span className="monitor-value text-temp">
            {stats?.gpu_power != null ? `${stats.gpu_power.toFixed(0)}W` : '--'}
          </span>
        </div>
      )}
    </div>
  );
}
