import React, { useState } from 'react';
import { X, Bell, Trash2, Plus, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PriceAlertsModal: React.FC = () => {
  const {
    activeModal,
    closeModals,
    priceAlerts,
    removePriceAlert,
    addPriceAlert,
    triggerSimulatedPriceDrop,
    products,
    formatPrice,
    openProductModal
  } = useApp();

  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || '');
  const [targetPrice, setTargetPrice] = useState<number>(0);
  const [email, setEmail] = useState('alex.vance@techspecs.org');
  const [added, setAdded] = useState(false);

  if (activeModal !== 'alerts') return null;

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || targetPrice <= 0) return;
    addPriceAlert(selectedProduct, targetPrice, email);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                Real-Time Price Radar & Alerts
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Automated webhook and browser push notifications on price fluctuations
              </p>
            </div>
          </div>

          <button
            onClick={closeModals}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* Active Alerts List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-slate-500">
                ACTIVE RADAR MONITORS ({priceAlerts.length})
              </span>
              <button
                onClick={triggerSimulatedPriceDrop}
                className="text-xs font-mono text-amber-500 hover:underline flex items-center gap-1"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate Price Drop Event</span>
              </button>
            </div>

            {priceAlerts.length === 0 ? (
              <div className="p-8 text-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 text-xs text-slate-500">
                No active price drop triggers configured. Set a target below.
              </div>
            ) : (
              <div className="space-y-2">
                {priceAlerts.map((alert) => {
                  const product = products.find((p) => p.id === alert.productId);
                  return (
                    <div
                      key={alert.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div className="space-y-1">
                        <h4 
                          onClick={() => openProductModal(alert.productId)}
                          className="font-bold text-slate-900 dark:text-white hover:text-amber-500 cursor-pointer"
                        >
                          {alert.productName}
                        </h4>
                        <div className="flex items-center gap-2 text-slate-500">
                          <span>Target: <strong className="text-amber-500 tabular-nums">{formatPrice(alert.targetPrice)}</strong></span>
                          <span>·</span>
                          <span>Current: <strong className="text-slate-700 dark:text-slate-300 tabular-nums">{formatPrice(alert.currentPrice)}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">
                          Armed
                        </span>
                        <button
                          onClick={() => removePriceAlert(alert.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                          title="Remove alert"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Create Alert Form */}
          <form onSubmit={handleCreateAlert} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-900 dark:text-white">
              Arm New Price Radar Monitor
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-500 block mb-1">TARGET HARDWARE SKU</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Current: {formatPrice(p.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 block mb-1">TARGET PRICE (USD)</label>
                  <input
                    type="number"
                    placeholder="e.g. 3800"
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">NOTIFICATION DISPATCH EMAIL</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-mono font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Arm Price Radar Alert</span>
            </button>

            {added && (
              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
                <span>Price radar successfully armed! Webhook listener registered.</span>
              </div>
            )}
          </form>

        </div>

      </div>
    </div>
  );
};
