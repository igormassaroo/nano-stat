/**
 * 网络信息卡片组件 / Card de Rede
 * 展示网络接口和流量统计
 */

import { Wifi } from 'lucide-react';
import type { NetworkInfo } from '../../types/hardware';
import { useI18n } from '../../i18n/useI18n';

interface NetworkCardProps {
  network: NetworkInfo;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes.toFixed(0)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatRate(bytesPerSec: number): string {
  if (bytesPerSec < 1024) return `${bytesPerSec.toFixed(0)} B/s`;
  if (bytesPerSec < 1024 * 1024) return `${(bytesPerSec / 1024).toFixed(1)} KB/s`;
  return `${(bytesPerSec / (1024 * 1024)).toFixed(1)} MB/s`;
}

export function NetworkCard({ network }: NetworkCardProps) {
  const { t } = useI18n();

  const totalRx = network.interfaces.reduce((sum, iface) => sum + iface.rx_bytes, 0);
  const totalTx = network.interfaces.reduce((sum, iface) => sum + iface.tx_bytes, 0);
  const totalRxRate = network.interfaces.reduce((sum, iface) => sum + iface.rx_rate, 0);
  const totalTxRate = network.interfaces.reduce((sum, iface) => sum + iface.tx_rate, 0);

  return (
    <div className="card" style={{ padding: '16px', minHeight: '200px' }}>
      {/* 标题 + 总流量同一行 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center">
          <Wifi className="w-4 h-4 text-blue-400" />
        </div>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{t('overlay_network')}</h3>
          <p className="text-xs text-gray-500">{network.interfaces.length} interface(s)</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <div className="bg-[var(--color-bg-input)] rounded-lg" style={{ padding: '6px 10px', minWidth: '120px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-gray-400">Download</span>
            </div>
            <p className="text-xs font-semibold text-green-400">{formatRate(totalRxRate)}</p>
            <p className="text-[10px] text-gray-500">Total: {formatBytes(totalRx)}</p>
          </div>
          <div className="bg-[var(--color-bg-input)] rounded-lg" style={{ padding: '6px 10px', minWidth: '120px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs text-gray-400">Upload</span>
            </div>
            <p className="text-xs font-semibold text-blue-400">{formatRate(totalTxRate)}</p>
            <p className="text-[10px] text-gray-500">Total: {formatBytes(totalTx)}</p>
          </div>
        </div>
      </div>

      {/* 接口列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {network.interfaces.slice(0, 3).map((iface, index) => (
          <div
            key={index}
            className="bg-[var(--color-bg-input)] rounded-lg"
            style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ minWidth: 0, flex: 1, marginRight: '12px' }}>
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }} className="truncate">
                {iface.name}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                {formatBytes(iface.rx_bytes)} RX | {formatBytes(iface.tx_bytes)} TX
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px', textAlign: 'right', flexShrink: 0 }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>↓ Download</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#10b981' }}>{formatRate(iface.rx_rate)}</span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>↑ Upload</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#3b82f6' }}>{formatRate(iface.tx_rate)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
