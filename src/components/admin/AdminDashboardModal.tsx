import React, { useState } from 'react';
import {
  X,
  SlidersHorizontal,
  DollarSign,
  TrendingUp,
  Users,
  Package,
  Download,
  Share2,
  RefreshCw,
  ShieldCheck,
  Check,
  AlertTriangle,
  Send,
  Lock,
  Cloud
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

export const AdminDashboardModal: React.FC = () => {
  const {
    activeModal,
    closeModals,
    products,
    updateProductStock,
    updateProductPrice,
    formatPrice,
    orders,
    isEncrypted,
    toggleEncryption,
    deviceSynced,
    lastSyncTime,
    triggerCloudSync,
    triggerSimulatedPriceDrop,
    currentUser,
    loginAsDemoUser
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'inventory' | 'social_marketing' | 'security'>('analytics');
  
  // Marketing campaign builder state
  const [campaignProduct, setCampaignProduct] = useState(products[0]?.id || '');
  const [campaignPlatform, setCampaignPlatform] = useState<'x' | 'discord' | 'reddit'>('x');
  const [campaignCopied, setCampaignCopied] = useState(false);

  // Stock edit state
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [newStockVal, setNewStockVal] = useState<number>(0);

  if (activeModal !== 'admin') return null;

  // KPIs
  const totalRevenueUSD = orders.reduce((sum, o) => sum + o.totalUSD, 0) + 142850;
  const conversionRate = 3.42;
  const activeSessions = 184;
  const aovUSD = totalRevenueUSD / (orders.length + 115);

  // Conversion funnel data
  const funnelSteps = [
    { step: 'Catalog Views', count: 12450, dropoff: '0%' },
    { step: 'Deep Spec Inspections', count: 6820, dropoff: '-45.2%' },
    { step: 'Added to Manifest', count: 2140, dropoff: '-68.6%' },
    { step: 'Initiated Checkout', count: 810, dropoff: '-62.1%' },
    { step: 'Completed Purchase', count: 426, dropoff: '-47.4%' }
  ];

  // Export reports
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Items Count', 'Total USD', 'Status', 'Payment Method'];
    const rows = orders.map((o) => [
      o.id,
      o.date,
      `"${o.shippingAddress.name}"`,
      o.items.reduce((acc, i) => acc + i.quantity, 0),
      o.totalUSD,
      o.status,
      `"${o.paymentMethod}"`
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Aether_Analytics_Report_${Date.now()}.csv`;
    a.click();
  };

  const handleExportJSON = () => {
    const reportData = {
      kpis: {
        totalRevenueUSD,
        conversionRate,
        activeSessions,
        aovUSD
      },
      orders,
      funnelSteps,
      inventorySummary: products.map((p) => ({
        id: p.id,
        name: p.name,
        stockCount: p.stockCount,
        warehouse: p.warehouse,
        priceUSD: p.price
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Aether_System_Metrics_${Date.now()}.json`;
    a.click();
  };

  // Generate marketing campaign text
  const selectedProd = products.find((p) => p.id === campaignProduct) || products[0];
  const generateCampaignCopy = () => {
    if (campaignPlatform === 'x') {
      return `⚡ INVENTORY RESTOCKED: ${selectedProd.brand} ${selectedProd.name}\n\n✓ Full 175W unthrottled silicon\n✓ ${selectedProd.specs.refreshRateHz || 240}Hz certified panel\n✓ Price: ${formatPrice(selectedProd.price)}\n\nOrder authenticated units: https://aetherhardware.io/item/${selectedProd.id}?utm_source=twitter&utm_medium=social&utm_campaign=enthusiast_drop`;
    }
    if (campaignPlatform === 'reddit') {
      return `**[Hardware In-Stock Notice] ${selectedProd.name} now in warehouse rotation**\n\nHey r/hardware, verified inventory just landed in NV-01 & FRA-02 hubs with 0.1mm Rapid Trigger/TGP verified.\n- Price: ${formatPrice(selectedProd.price)}\n- Lab score: ${selectedProd.benchmarks.overallScore}/100\n- Review matrix: https://aetherhardware.io/specs/${selectedProd.id}`;
    }
    return `🚨 **@everyone ENTHUSIAST DROP ALERT**\n**${selectedProd.name}** is live in stock!\n• **Stock Left:** ${selectedProd.stockCount} units\n• **Price:** ${formatPrice(selectedProd.price)}\nClaim before allocation exhausts: <https://aetherhardware.io>`;
  };

  const handleCopyCampaign = () => {
    navigator.clipboard?.writeText(generateCampaignCopy());
    setCampaignCopied(true);
    setTimeout(() => setCampaignCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                Administrative Performance Console
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Real-time CRO analytics, inventory control, and social campaign tools
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:text-amber-500 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-amber-500/40 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:text-amber-500 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-amber-500/40 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
            <button
              onClick={closeModals}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveAdminTab('analytics')}
            className={`pb-3 px-2 border-b-2 font-medium transition-colors ${
              activeAdminTab === 'analytics'
                ? 'border-amber-500 text-amber-500 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            CRO & Sales Analytics
          </button>
          <button
            onClick={() => setActiveAdminTab('inventory')}
            className={`pb-3 px-2 border-b-2 font-medium transition-colors ${
              activeAdminTab === 'inventory'
                ? 'border-amber-500 text-amber-500 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Real-Time Inventory Manager
          </button>
          <button
            onClick={() => setActiveAdminTab('social_marketing')}
            className={`pb-3 px-2 border-b-2 font-medium transition-colors ${
              activeAdminTab === 'social_marketing'
                ? 'border-amber-500 text-amber-500 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Social Marketing Engine
          </button>
          <button
            onClick={() => setActiveAdminTab('security')}
            className={`pb-3 px-2 border-b-2 font-medium transition-colors ${
              activeAdminTab === 'security'
                ? 'border-amber-500 text-amber-500 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Data Privacy & Cloud Sync
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* TAB 1: CRO & Sales Analytics */}
          {activeAdminTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* Top 4 KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
                  <span className="text-[11px] font-mono text-slate-500">GROSS MERCHANDISE VALUE</span>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                    {formatPrice(totalRevenueUSD)}
                  </div>
                  <span className="text-[10px] text-emerald-500 font-mono">+18.4% vs last cycle</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
                  <span className="text-[11px] font-mono text-slate-500">CONVERSION RATE (CRO)</span>
                  <div className="text-xl font-bold font-mono text-amber-500 tabular-nums">
                    {conversionRate}%
                  </div>
                  <span className="text-[10px] text-emerald-500 font-mono">+0.6% from 1-click checkout</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
                  <span className="text-[11px] font-mono text-slate-500">AVERAGE ORDER VALUE</span>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                    {formatPrice(aovUSD)}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Flagship laptop mix</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
                  <span className="text-[11px] font-mono text-slate-500">ACTIVE SHOPPERS</span>
                  <div className="text-xl font-bold font-mono text-emerald-500 tabular-nums">
                    {activeSessions}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Simulated live nodes</span>
                </div>
              </div>

              {/* Conversion Rate Funnel Analysis */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase text-slate-900 dark:text-white">
                    Automated Conversion Funnel Optimization
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">Rolling 24 Hours</span>
                </div>

                <div className="space-y-3">
                  {funnelSteps.map((step, idx) => {
                    const widthPercent = (step.count / funnelSteps[0].count) * 100;
                    return (
                      <div key={idx} className="space-y-1 text-xs font-mono">
                        <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                          <span>{step.step}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400">{step.dropoff}</span>
                            <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                              {step.count.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            style={{ width: `${widthPercent}%` }}
                            className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Drop Simulation Trigger for testing */}
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-center justify-between gap-4 text-xs font-mono">
                <div>
                  <span className="text-amber-500 font-bold block">TEST PRICE RADAR DROP TRIGGER</span>
                  <span className="text-slate-600 dark:text-slate-400 font-sans">
                    Simulates a 12% price reduction on the flagship to verify in-app and push notification delivery.
                  </span>
                </div>
                <button
                  onClick={triggerSimulatedPriceDrop}
                  className="px-4 py-2 font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap"
                >
                  Trigger Price Drop Event
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: Real-Time Inventory Manager */}
          {activeAdminTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">
                  REAL-TIME WAREHOUSE SKU AUDIT & STOCK CONTROLS
                </span>
                <span className="text-[11px] font-mono text-emerald-500">Live Telemetry Active</span>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-xs font-mono border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <tr>
                      <th className="py-3 px-4 text-left">SKU / Item</th>
                      <th className="py-3 px-4 text-left">Warehouse Hub</th>
                      <th className="py-3 px-4 text-left">Price (USD)</th>
                      <th className="py-3 px-4 text-left">Units In Stock</th>
                      <th className="py-3 px-4 text-right">Quick Stock Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-900 dark:text-white block">{p.name}</span>
                          <span className="text-[10px] text-slate-400">{p.id}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{p.warehouse}</td>
                        <td className="py-3 px-4 font-bold tabular-nums">{formatPrice(p.price)}</td>
                        <td className="py-3 px-4">
                          <span className={`tabular-nums font-bold ${p.stockCount <= 3 ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {p.stockCount} units
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => updateProductStock(p.id, Math.max(0, p.stockCount - 1))}
                              className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                              title="Deduct 1"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => updateProductStock(p.id, p.stockCount + 5)}
                              className="px-2 py-1 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                              title="Restock +5"
                            >
                              +5 Restock
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Social Media Marketing Engine */}
          {activeAdminTab === 'social_marketing' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase text-slate-900 dark:text-white">
                  Social Media Campaign & UTM Link Generator
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <label className="text-slate-500 block mb-1">TARGET PRODUCT</label>
                    <select
                      value={campaignProduct}
                      onChange={(e) => setCampaignProduct(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({formatPrice(p.price)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-500 block mb-1">CHANNEL PLATFORM</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['x', 'discord', 'reddit'] as const).map((plat) => (
                        <button
                          key={plat}
                          onClick={() => setCampaignPlatform(plat)}
                          className={`px-3 py-2 rounded-lg border font-bold uppercase ${
                            campaignPlatform === plat
                              ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                              : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {plat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Generated Copy Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">FORMATTED CAMPAIGN COPY</span>
                    <button
                      onClick={handleCopyCampaign}
                      className="text-amber-500 hover:underline flex items-center gap-1"
                    >
                      {campaignCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{campaignCopied ? 'Copied to Clipboard!' : 'Copy Formatted Post'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-lg bg-slate-900 text-slate-200 text-xs font-mono whitespace-pre-wrap border border-slate-800">
                    {generateCampaignCopy()}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Data Privacy & Cloud Sync */}
          {activeAdminTab === 'security' && (
            <div className="space-y-6">
              
              {/* Encryption controls */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-amber-500" />
                    <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase">
                      Client-Side Storage Encryption (AES-256-GCM)
                    </h3>
                  </div>
                  <button
                    onClick={toggleEncryption}
                    className={`px-4 py-2 text-xs font-mono font-semibold rounded-lg transition-colors ${
                      isEncrypted
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isEncrypted ? 'Encryption Active' : 'Enable AES-256'}
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  When enabled, all locally cached hardware watchlists, user sessions, and offline checkout queues are encrypted in the browser using the Web Crypto API prior to storage serialization.
                </p>
              </div>

              {/* Cloud Synchronization */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-amber-500" />
                    <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase">
                      Multi-Device Cloud Synchronization
                    </h3>
                  </div>
                  <button
                    onClick={triggerCloudSync}
                    className="px-4 py-2 text-xs font-mono font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Now</span>
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>Cloud Node Status: {deviceSynced ? 'Synchronized' : 'Syncing...'}</span>
                  <span>Last Sync: {lastSyncTime}</span>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
