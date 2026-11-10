import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OfflineBanner: React.FC = () => {
  const { isOffline, toggleSimulatedOffline, t } = useApp();

  if (!isOffline) return null;

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-xs font-mono text-amber-500 flex items-center justify-between z-30 relative backdrop-blur-sm">
      <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>{t('offline_mode_active')}</span>
        </div>
        <button
          onClick={toggleSimulatedOffline}
          className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors text-[11px] shrink-0"
        >
          {t('simulate_online')}
        </button>
      </div>
    </div>
  );
};
