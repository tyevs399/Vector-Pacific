import React from 'react';
import { ShieldCheck, Globe, Wifi, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { isOffline, isEncrypted, lastSyncTime, setActiveModal } = useApp();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#090d14] text-xs font-mono text-slate-500 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold tracking-wider">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block transform rotate-45" />
              <span>AETHER//HARDWARE</span>
            </div>
            <p className="text-slate-500 font-sans leading-relaxed text-xs">
              Direct enthusiast hardware exchange. Verified continuous TGP power limits, Hall effect input physics, and calibrated QD-OLED optics.
            </p>
          </div>

          {/* Column 2: Global Fulfillment Hubs */}
          <div className="space-y-2">
            <span className="text-slate-900 dark:text-white font-semibold uppercase block text-[11px]">
              FULFILLMENT HUBS
            </span>
            <ul className="space-y-1.5 text-slate-500">
              <li>Hub NV-01: Reno / Tahoe, Nevada (US West)</li>
              <li>Hub FRA-02: Frankfurt am Main (EU Central)</li>
              <li>Hub TYO-04: Ota City, Tokyo (Asia Pacific)</li>
              <li>All nodes connected via synchronized inventory ledger</li>
            </ul>
          </div>

          {/* Column 3: Platform Architecture */}
          <div className="space-y-2">
            <span className="text-slate-900 dark:text-white font-semibold uppercase block text-[11px]">
              ARCHITECTURE & PRIVACY
            </span>
            <ul className="space-y-1.5 text-slate-500">
              <li>Offline First: Service Worker & Local Cache</li>
              <li>Encryption: AES-256-GCM Web Crypto</li>
              <li>Multi-Currency: USD, EUR, GBP, JPY, CAD, AUD</li>
              <li>Sync Status: Cloud synchronized ({lastSyncTime})</li>
            </ul>
          </div>

          {/* Column 4: Quick Navigation & Tools */}
          <div className="space-y-2">
            <span className="text-slate-900 dark:text-white font-semibold uppercase block text-[11px]">
              POWER USER CONSOLE
            </span>
            <div className="flex flex-col space-y-1 text-slate-600 dark:text-slate-400">
              <button
                onClick={() => setActiveModal('compare')}
                className="text-left hover:text-amber-500 transition-colors"
              >
                Specification Matrix
              </button>
              <button
                onClick={() => setActiveModal('guides')}
                className="text-left hover:text-amber-500 transition-colors"
              >
                Hardware Buying Guides & Calculators
              </button>
              <button
                onClick={() => setActiveModal('alerts')}
                className="text-left hover:text-amber-500 transition-colors"
              >
                Price Radar Alerts
              </button>
              <button
                onClick={() => setActiveModal('admin')}
                className="text-left hover:text-amber-500 transition-colors"
              >
                Administrative Performance Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Quiet Copyright */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © 2026 AetherHardware Global Systems. All hardware trademarks property of their respective manufacturers.
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>PCI-DSS Tier 1 Compliant</span>
            <span>·</span>
            <span>ISO 9001 Benchmark Testing</span>
            <span>·</span>
            <span>RFC 7519 Verified</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
