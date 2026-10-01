/**
 * 首页组件
 * 展示硬件概览信息，类似游戏++的布局
 */

import { useState } from 'react';
import { useHardwareData } from '../hooks/useHardwareData';
import { HardwareOverviewSection } from '../components/hardware/HardwareOverviewSection';
import { CpuCard, GpuCard, MemoryCard, DiskCard, NetworkCard } from '../components/hardware';
import { Clock, RefreshCw } from 'lucide-react';
import { useI18n } from '../i18n/useI18n';

export function HomePage() {
  const { t, language } = useI18n();
  const { overview, realtime, cpuHistory, gpuHistory, loading, error, refresh } = useHardwareData(1000);
  const [selectedGpuIndex, setSelectedGpuIndex] = useState(0);

  // 概览中的静态信息 + 实时的使用率/温度（overview 只低频刷新，使用率须用实时数据）
  const liveCpu = overview
    ? {
        ...overview.cpu,
        usage: realtime?.cpu_usage ?? overview.cpu.usage,
        temperature: realtime?.cpu_temp ?? overview.cpu.temperature,
      }
    : null;

  const allGpus = overview?.gpus && overview.gpus.length > 0 ? overview.gpus : (overview?.gpu ? [overview.gpu] : []);
  const currentGpu = allGpus[selectedGpuIndex] || overview?.gpu || null;

  const liveGpu = currentGpu
    ? {
        ...currentGpu,
        usage: selectedGpuIndex === 0 ? (realtime?.gpu_usage ?? currentGpu.usage) : currentGpu.usage,
        temperature: selectedGpuIndex === 0 ? (realtime?.gpu_temp ?? currentGpu.temperature) : currentGpu.temperature,
      }
    : null;

  // 获取当前时间
  const locale = language === 'pt-BR' ? 'pt-BR' : language === 'en' ? 'en-US' : 'zh-CN';
  const currentTime = new Date().toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 顶部状态栏 */}
      <div className="flex items-center justify-end px-6 py-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-4">
          {loading && (
            <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              {t('loading')}
            </span>
          )}
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
            <Clock className="w-4 h-4" />
            <span>{currentTime}</span>
          </div>
          <button
            onClick={refresh}
            className="flex items-center gap-2 rounded-lg transition-all hover:opacity-80 px-3.5 py-1.5 text-[13px] text-[var(--color-text-secondary)] bg-[var(--color-bg-input)] border border-[var(--color-border)]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t('refresh')}
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mx-8 mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* 主内容区域 */}
      <div className="flex-1 overflow-auto p-4 px-5">
        <div className="grid grid-cols-[300px_1fr] gap-4">
          {/* 左侧：硬件概览 */}
          <div>
            <HardwareOverviewSection data={overview} />
          </div>

          {/* 右侧：详细信息卡片 */}
          <div>
            {/* CPU 和 GPU 卡片 */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {overview ? (
                <>
                  <CpuCard cpu={liveCpu!} usageHistory={cpuHistory} />
                  <GpuCard
                    gpu={liveGpu}
                    gpus={allGpus}
                    selectedIndex={selectedGpuIndex}
                    onSelectGpu={setSelectedGpuIndex}
                    usageHistory={selectedGpuIndex === 0 ? gpuHistory : []}
                  />
                </>
              ) : (
                <>
                  <div className="card p-6 animate-pulse">
                    <div className="h-48 bg-gray-700/50 rounded-lg"></div>
                  </div>
                  <div className="card p-6 animate-pulse">
                    <div className="h-48 bg-gray-700/50 rounded-lg"></div>
                  </div>
                </>
              )}
            </div>

            {/* 内存、磁盘卡片 */}
            <div className="grid grid-cols-2 gap-3.5 mb-3.5">
              {overview ? (
                <>
                  <MemoryCard memory={overview.memory} />
                  <DiskCard disks={overview.disks} />
                </>
              ) : (
                <>
                  <div className="card p-6 animate-pulse">
                    <div className="h-40 bg-gray-700/50 rounded-lg"></div>
                  </div>
                  <div className="card p-6 animate-pulse">
                    <div className="h-40 bg-gray-700/50 rounded-lg"></div>
                  </div>
                </>
              )}
            </div>

            {/* 网络卡片 - 右侧整行 */}
            {overview ? (
              <NetworkCard network={overview.network} />
            ) : (
              <div className="card p-6 animate-pulse">
                <div className="h-40 bg-gray-700/50 rounded-lg"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
