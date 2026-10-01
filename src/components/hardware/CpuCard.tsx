/**
 * CPU 信息卡片组件 / Card de CPU
 * 展示 CPU 详细信息和使用率图表
 */

import { useEffect, useState } from 'react';
import { Cpu, Info } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { isLhmDriverMissing } from '../../api/hardware';
import type { CpuInfo } from '../../types/hardware';
import { useI18n } from '../../i18n/useI18n';

interface CpuCardProps {
  cpu: CpuInfo;
  usageHistory: number[];
}

export function CpuCard({ cpu, usageHistory }: CpuCardProps) {
  const { t } = useI18n();
  const [driverMissing, setDriverMissing] = useState(false);

  useEffect(() => {
    isLhmDriverMissing().then(setDriverMissing).catch(() => {});
  }, []);

  const chartData = usageHistory.map((value, index) => ({
    index,
    usage: value,
  }));

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return '#ef4444';
    if (usage >= 70) return '#f59e0b';
    return '#0ea5e9';
  };

  const usageColor = getUsageColor(cpu.usage);

  return (
    <div className="card p-4">
      {/* 卡片标题 */}
      <div className="flex items-center gap-3 mb-3.5">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <Cpu className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{t('hw_processor')}</h3>
          <p className="text-xs text-[var(--color-text-muted)] truncate">{cpu.name}</p>
        </div>
      </div>

      {/* 主要信息区域 */}
      <div className="grid grid-cols-2 gap-3 mb-3.5">
        {/* 使用率 */}
        <div className="bg-[var(--color-bg-input)] rounded-lg p-3">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs text-[var(--color-text-muted)]">{t('hw_load')}</span>
            <span className="text-xl font-bold" style={{ color: usageColor }}>
              {cpu.usage.toFixed(0)}%
            </span>
          </div>
          <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${cpu.usage}%`, backgroundColor: usageColor }}
            />
          </div>
        </div>

        {/* 温度 */}
        <div className="bg-[var(--color-bg-input)] rounded-lg p-3">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs text-[var(--color-text-muted)]">{t('hw_temp')}</span>
            <span className="text-xl font-bold text-emerald-400">
              {cpu.temperature ? `${cpu.temperature.toFixed(0)}°C` : 'N/A'}
            </span>
          </div>
          <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${cpu.temperature ? (cpu.temperature / 100) * 100 : 0}%` }}
            />
          </div>
          {!cpu.temperature && driverMissing && (
            <div className="flex items-start gap-1.5 mt-2 text-[11px] text-[var(--color-text-muted)]">
              <Info className="w-3 h-3 flex-shrink-0 mt-0.5 text-amber-400" />
              <span>
                <a href="https://pawnio.eu" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                  Driver PawnIO
                </a>{' '}
                {t('hw_pawnio_hint')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 使用率图表 */}
      <div className="bg-[var(--color-bg-input)] rounded-lg h-20 mb-3.5 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis domain={[0, 100]} hide />
            <Area
              type="monotone"
              dataKey="usage"
              stroke="#0ea5e9"
              strokeWidth={1.5}
              fill="url(#cpuGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 详细信息 */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <span className="block text-xs text-[var(--color-text-muted)]">Núcleos</span>
          <span className="text-sm font-medium text-[var(--color-text-primary)]">{cpu.cores}</span>
        </div>
        <div className="text-center">
          <span className="block text-xs text-[var(--color-text-muted)]">Threads</span>
          <span className="text-sm font-medium text-[var(--color-text-primary)]">{cpu.threads}</span>
        </div>
        <div className="text-center">
          <span className="block text-xs text-[var(--color-text-muted)]">{t('hw_freq')}</span>
          <span className="text-emerald-400 text-sm font-medium">{cpu.frequency} MHz</span>
        </div>
      </div>
    </div>
  );
}
