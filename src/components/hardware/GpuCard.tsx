/**
 * GPU 信息卡片组件 / Card de GPU
 * 展示 GPU 详细信息和使用率图表
 */

import { MonitorPlay } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import type { GpuInfo } from '../../types/hardware';
import { useI18n } from '../../i18n/useI18n';

interface GpuCardProps {
  gpu: GpuInfo | null;
  usageHistory: number[];
}

export function GpuCard({ gpu, usageHistory }: GpuCardProps) {
  const { t } = useI18n();

  const chartData = usageHistory.map((value, index) => ({
    index,
    usage: value,
  }));

  if (!gpu) {
    return (
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div className="w-9 h-9 rounded-lg bg-green-500/15 flex items-center justify-center">
            <MonitorPlay className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{t('hw_gpu')}</h3>
            <p className="text-xs text-gray-500">Nenhuma GPU detectada</p>
          </div>
        </div>
        <div className="text-center py-8 text-gray-500 text-sm">
          Verifique se os drivers da placa de vídeo estão instalados.
        </div>
      </div>
    );
  }

  const vramUsagePercent = gpu.vram_total > 0 ? (gpu.vram_used / gpu.vram_total) * 100 : 0;

  return (
    <div className="card" style={{ padding: '16px' }}>
      {/* 卡片标题 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        <div className="w-9 h-9 rounded-lg bg-green-500/15 flex items-center justify-center">
          <MonitorPlay className="w-4 h-4 text-green-400" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{t('hw_gpu')}</h3>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }} className="truncate">{gpu.name}</p>
        </div>
      </div>

      {/* 主要信息区域 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
        {/* 显卡占用 */}
        <div className="bg-[var(--color-bg-input)] rounded-lg" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{t('hw_gpu_load')}</span>
            <span className="text-xl font-bold text-green-400">
              {gpu.usage.toFixed(0)}%
            </span>
          </div>
          <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${gpu.usage}%` }}
            />
          </div>
        </div>

        {/* 显存占用 */}
        <div className="bg-[var(--color-bg-input)] rounded-lg" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{t('hw_vram_load')}</span>
            <span className="text-xl font-bold text-green-400">
              {vramUsagePercent.toFixed(0)}%
            </span>
          </div>
          <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${vramUsagePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 使用率图表 */}
      <div className="bg-[var(--color-bg-input)] rounded-lg" style={{ height: '80px', marginBottom: '14px', padding: '8px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gpuGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis domain={[0, 100]} hide />
            <Area
              type="monotone"
              dataKey="usage"
              stroke="#10b981"
              strokeWidth={1.5}
              fill="url(#gpuGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 详细信息 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)' }}>{t('hw_vram')}</span>
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {(gpu.vram_total / 1024).toFixed(0)} GB
          </span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)' }}>{t('hw_temp')}</span>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#10b981' }}>
            {gpu.temperature ? `${gpu.temperature.toFixed(0)}°C` : 'N/A'}
          </span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)' }}>Clock</span>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#10b981' }}>
            {gpu.core_clock ? `${gpu.core_clock} MHz` : 'N/A'}
          </span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)' }}>TDP</span>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#10b981' }}>
            {gpu.power_usage ? `${gpu.power_usage.toFixed(0)} W` : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}
