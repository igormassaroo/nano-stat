/**
 * 硬件概览左侧区域组件 / Visão Geral de Hardware
 * 展示 CPU、GPU、内存、磁盘、网络的概览信息
 */

import { useState } from 'react';
import { Cpu, MonitorPlay, MemoryStick, HardDrive, Monitor, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import type { HardwareOverview } from '../../types/hardware';
import { useI18n } from '../../i18n/useI18n';

interface HardwareOverviewSectionProps {
  data: HardwareOverview | null;
}

function generateHardwareInfoText(data: HardwareOverview, t: (k: any) => string): string {
  const lines: string[] = [];
  lines.push(`=== ${t('hw_overview')} ===\n`);
  
  // CPU
  lines.push(`【${t('hw_processor')}】`);
  lines.push(`Modelo: ${data.cpu.name}`);
  lines.push(`${t('hw_cores_threads')}: ${data.cpu.cores} / ${data.cpu.threads}`);
  lines.push(`${t('hw_freq')}: ${data.cpu.frequency}MHz`);
  lines.push(`${t('hw_usage')}: ${data.cpu.usage.toFixed(1)}%`);
  lines.push('');
  
  // GPU
  if (data.gpu) {
    lines.push(`【${t('hw_gpu')}】`);
    lines.push(`Modelo: ${data.gpu.name}`);
    lines.push(`${t('hw_vram')}: ${(data.gpu.vram_total / 1024).toFixed(0)}GB`);
    if (data.gpu.driver_version) {
      lines.push(`${t('hw_driver')}: ${data.gpu.driver_version}`);
    }
    lines.push('');
  }
  
  // 内存
  lines.push(`【${t('hw_memory')}】`);
  lines.push(`Tipo: ${data.memory.memory_type || 'DDR4'}`);
  lines.push(`${t('hw_capacity')}: ${(data.memory.total / 1024).toFixed(0)}GB`);
  lines.push(`${t('hw_used')}: ${(data.memory.used / 1024).toFixed(1)}GB (${data.memory.usage.toFixed(1)}%)`);
  lines.push('');
  
  // 磁盘
  lines.push(`【${t('hw_storage')}】`);
  data.disks.forEach(disk => {
    lines.push(`${disk.name || disk.mount_point} (${disk.disk_type}): ${disk.total.toFixed(0)}GB, ${t('hw_available')} ${disk.available.toFixed(0)}GB`);
  });
  lines.push('');
  
  // 显示器
  if (data.display && data.display.width > 0 && data.display.refresh_rate > 0) {
    lines.push(`【${t('hw_display')}】`);
    lines.push(`${t('hw_resolution')}: ${data.display.width}×${data.display.height}`);
    lines.push(`${t('hw_refresh_rate')}: ${data.display.refresh_rate}Hz`);
  }
  
  return lines.join('\n');
}

export function HardwareOverviewSection({ data }: HardwareOverviewSectionProps) {
  const { t } = useI18n();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyInfo = async () => {
    if (!data) return;
    try {
      const text = generateHardwareInfoText(data, t);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!data) {
    return (
      <div className="card p-4">
        <div className="flex flex-col gap-4">
          <div className="h-4 bg-gray-700/50 rounded w-1/3"></div>
          <div className="h-20 bg-gray-700/50 rounded-lg"></div>
          <div className="h-20 bg-gray-700/50 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-4">
      {/* 标题栏 */}
      <div className={`flex items-center gap-2.5 ${isCollapsed ? 'mb-0' : 'mb-4'}`}>
        {/* 折叠按钮 */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2.5 flex-1 bg-transparent border-none cursor-pointer p-0"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <h2 className="flex-1 text-left text-sm font-semibold text-[var(--color-text-primary)]">{t('hw_overview')}</h2>
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
        
        {/* 复制按钮 */}
        <button
          onClick={handleCopyInfo}
          className={`flex items-center gap-1.5 rounded-md transition-all hover:bg-[var(--color-bg-input)] px-2.5 py-1.5 text-[11px] border border-[var(--color-border)] bg-transparent ${
            copied ? 'text-emerald-500' : 'text-[var(--color-text-muted)]'
          }`}
          title={t('hw_copy_info')}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              {t('hw_copied')}
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              {t('hw_copy_info')}
            </>
          )}
        </button>
      </div>

      {/* 内容区域 */}
      <div style={{ 
        position: 'relative',
        maxHeight: isCollapsed ? '260px' : '1000px',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease-in-out'
      }}>
        {/* CPU 信息 */}
        <div className="mb-3.5 pb-3.5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-1.5 mb-2">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-gray-400">{t('hw_processor')}</span>
          </div>
          <p className="text-xs font-medium text-[var(--color-text-primary)] mb-1.5">{data.cpu.name}</p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="text-[var(--color-text-muted)]">
              Núcleos: <span className="text-[var(--color-text-secondary)]">{data.cpu.cores}</span>
            </div>
            <div className="text-[var(--color-text-muted)]">
              Threads: <span className="text-[var(--color-text-secondary)]">{data.cpu.threads}</span>
            </div>
            <div className="text-[var(--color-text-muted)]">
              {t('hw_freq')}: <span className="text-emerald-400 font-medium">{data.cpu.frequency}MHz</span>
            </div>
            <div className="text-[var(--color-text-muted)]">
              {t('hw_usage')}: <span className="text-emerald-400 font-medium">{data.cpu.usage.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* GPU 信息 */}
        {data.gpu && (
          <div className="mb-3.5 pb-3.5 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-1.5 mb-2">
              <MonitorPlay className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs text-gray-400">{t('hw_gpu')}</span>
            </div>
            <p className="text-xs font-medium text-[var(--color-text-primary)] mb-1.5">{data.gpu.name}</p>
            <div className="flex flex-col gap-0.5 text-xs">
              <div className="text-[var(--color-text-muted)]">
                {t('hw_vram')}: <span className="text-[var(--color-text-secondary)]">{(data.gpu.vram_total / 1024).toFixed(0)}GB</span>
                <span className="text-green-400 ml-1">({data.gpu.vram_used > 0 ? ((data.gpu.vram_used / data.gpu.vram_total) * 100).toFixed(0) : 0}% {t('hw_used')})</span>
              </div>
              {data.gpu.pcie_info && (
                <div className="text-[var(--color-text-muted)]">
                  PCIe: <span className="text-[var(--color-text-secondary)]">{data.gpu.pcie_info}</span>
                </div>
              )}
              {data.gpu.driver_version && (
                <div className="text-[var(--color-text-muted)]">
                  {t('hw_driver')}: <span className="text-[var(--color-text-secondary)]">{data.gpu.driver_version}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 内存信息 */}
        <div className="mb-3.5 pb-3.5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-1.5 mb-2">
            <MemoryStick className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs text-gray-400">{t('hw_memory')}</span>
          </div>
          <p className="text-xs font-medium text-[var(--color-text-primary)] mb-1">
            {data.memory.memory_type || 'DDR5/DDR4'} {(data.memory.total / 1024).toFixed(0)}GB
          </p>
          <div className="text-xs text-[var(--color-text-muted)]">
            {t('hw_used')}: <span className="text-purple-400 font-medium">{(data.memory.used / 1024).toFixed(1)}GB</span>
            <span className="mx-2">|</span>
            {t('hw_available')}: <span className="text-[var(--color-text-secondary)]">{(data.memory.available / 1024).toFixed(1)}GB</span>
          </div>
        </div>

        {/* 磁盘信息 */}
        <div className="mb-3.5 pb-3.5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-1.5 mb-2">
            <HardDrive className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs text-gray-400">{t('hw_storage')}</span>
          </div>
          <div className="flex flex-col gap-2">
            {data.disks.slice(0, 4).map((disk, index) => (
              <div key={index} className="text-xs">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-medium text-[var(--color-text-primary)]">{disk.name || disk.mount_point}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-bg-input)] text-[var(--color-text-muted)]">{disk.disk_type}</span>
                </div>
                <div className="text-[var(--color-text-muted)]">
                  {t('hw_capacity')}: <span className="text-orange-400">{disk.total.toFixed(0)}GB</span>
                  <span className="mx-1">|</span>
                  {t('hw_available')}: <span className="text-[var(--color-text-secondary)]">{disk.available.toFixed(0)}GB</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 显示器信息 */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Monitor className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs text-gray-400">{t('hw_display')}</span>
          </div>
          <p className="text-xs font-medium text-[var(--color-text-primary)] mb-1">Display</p>
          <div className="text-xs text-[var(--color-text-muted)]">
            {t('hw_resolution')}: <span className="text-[var(--color-text-secondary)]">
              {data.display && data.display.width > 0
                ? `${data.display.width}×${data.display.height}`
                : '--'}
            </span>
            <span className="mx-2">|</span>
            {t('hw_refresh_rate')}: <span className="text-blue-400 font-medium">
              {data.display && data.display.refresh_rate > 0 ? `${data.display.refresh_rate}Hz` : '--'}
            </span>
          </div>
        </div>

        <div className="h-[33px]" />

        {isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 h-[60px] pointer-events-none bg-[linear-gradient(to_bottom,transparent,var(--color-bg-card))]" />
        )}
      </div>

      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-full flex items-center justify-center gap-1 mt-2 py-1.5 bg-transparent border-none cursor-pointer text-[var(--color-text-muted)] text-[11px] hover:text-[var(--color-text-secondary)] transition-colors"
        >
          <ChevronDown className="w-3.5 h-3.5" />
          {t('hw_expand_more')}
        </button>
      )}
    </div>
  );
}
