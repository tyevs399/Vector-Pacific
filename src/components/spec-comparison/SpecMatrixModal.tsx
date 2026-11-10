import React, { useState } from 'react';
import { X, Check, Scale, Download, Share2, Plus, Trash2, Trophy } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

export const SpecMatrixModal: React.FC = () => {
  const {
    activeModal,
    closeModals,
    compareList,
    toggleCompare,
    clearCompare,
    products,
    formatPrice,
    addToCart,
    openProductModal
  } = useApp();

  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  if (activeModal !== 'compare') return null;

  // Selected products for comparison
  const comparedProducts: Product[] = compareList
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  // Determine winners
  const highestTgp = Math.max(...comparedProducts.map((p) => p.specs.tgpWatts || 0));
  const highestRefresh = Math.max(...comparedProducts.map((p) => p.specs.refreshRateHz || 0));
  const lowestLatency = Math.min(...comparedProducts.map((p) => p.specs.responseTimeMs || 999));
  const highestBenchmark = Math.max(...comparedProducts.map((p) => p.benchmarks.overallScore));

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Spec Metric', ...comparedProducts.map((p) => `"${p.name}"`)];
    const rows = [
      ['Brand', ...comparedProducts.map((p) => `"${p.brand}"`)],
      ['Category', ...comparedProducts.map((p) => `"${p.category}"`)],
      ['Price (USD)', ...comparedProducts.map((p) => p.price)],
      ['TGP (Watts)', ...comparedProducts.map((p) => p.specs.tgpWatts || 'N/A')],
      ['Display', ...comparedProducts.map((p) => `"${p.specs.display || 'N/A'}"`)],
      ['Refresh Rate (Hz)', ...comparedProducts.map((p) => p.specs.refreshRateHz || 'N/A')],
      ['Response Time (ms)', ...comparedProducts.map((p) => p.specs.responseTimeMs || 'N/A')],
      ['CPU', ...comparedProducts.map((p) => `"${p.specs.cpu || 'N/A'}"`)],
      ['GPU', ...comparedProducts.map((p) => `"${p.specs.gpu || 'N/A'}"`)],
      ['RAM', ...comparedProducts.map((p) => `"${p.specs.ram || 'N/A'}"`)],
      ['Weight (kg)', ...comparedProducts.map((p) => p.specs.weightKg || 'N/A')],
      ['Overall Lab Score', ...comparedProducts.map((p) => p.benchmarks.overallScore)]
    ];

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AetherHardware_Spec_Comparison_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Reddit markdown table
  const handleCopyMarkdown = () => {
    let md = `| Specification | ${comparedProducts.map((p) => p.name).join(' | ')} |\n`;
    md += `| :--- | ${comparedProducts.map(() => ':---').join(' | ')} |\n`;
    md += `| **Price** | ${comparedProducts.map((p) => formatPrice(p.price)).join(' | ')} |\n`;
    md += `| **TGP** | ${comparedProducts.map((p) => p.specs.tgpWatts ? `${p.specs.tgpWatts}W` : 'N/A').join(' | ')} |\n`;
    md += `| **Display / Panel** | ${comparedProducts.map((p) => p.specs.display || 'N/A').join(' | ')} |\n`;
    md += `| **Refresh Rate** | ${comparedProducts.map((p) => p.specs.refreshRateHz ? `${p.specs.refreshRateHz}Hz` : 'N/A').join(' | ')} |\n`;
    md += `| **CPU** | ${comparedProducts.map((p) => p.specs.cpu || 'N/A').join(' | ')} |\n`;
    md += `| **GPU** | ${comparedProducts.map((p) => p.specs.gpu || 'N/A').join(' | ')} |\n`;
    md += `| **Overall Lab Score** | ${comparedProducts.map((p) => `${p.benchmarks.overallScore}/100`).join(' | ')} |\n`;

    navigator.clipboard?.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-6xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                Hardware Specification Matrix
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Side-by-side engineering differential with lab benchmarks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparedProducts.length > 0 && (
              <>
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:text-amber-500 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-amber-500/40 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>

                <button
                  onClick={handleCopyMarkdown}
                  className="px-3 py-1.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:text-amber-500 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-amber-500/40 transition-colors flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedMarkdown ? 'Copied MD!' : 'Reddit MD'}</span>
                </button>

                <button
                  onClick={clearCompare}
                  className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Clear All
                </button>
              </>
            )}

            <button
              onClick={closeModals}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {comparedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <Scale className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                No hardware units currently staged in the comparison matrix.
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Click the compare icon on any product in the catalog to add up to 4 devices for comprehensive spec inspection.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    // Auto add 2 flagship laptops for quick evaluation
                    toggleCompare(products[0].id);
                    if (products[1]) toggleCompare(products[1].id);
                  }}
                  className="px-4 py-2 text-xs font-mono font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors"
                >
                  Load Flagship Laptop Comparison
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-xs font-mono border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left py-4 px-4 font-semibold text-slate-400 uppercase w-48">
                      Device Overview
                    </th>
                    {comparedProducts.map((p) => (
                      <th key={p.id} className="py-4 px-4 text-left w-64 align-top">
                        <div className="space-y-2">
                          <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950/40">
                            <img
                              src={p.image}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => toggleCompare(p.id)}
                              className="absolute top-1.5 right-1.5 p-1 bg-slate-950/80 hover:bg-rose-500 text-slate-300 hover:text-white rounded transition-colors"
                              title="Remove from comparison"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <div>
                            <span className="text-[10px] text-amber-500 font-bold uppercase">{p.brand}</span>
                            <h4 
                              onClick={() => openProductModal(p.id)}
                              className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-amber-500 cursor-pointer"
                            >
                              {p.name}
                            </h4>
                            <div className="text-sm font-bold text-slate-900 dark:text-white pt-1">
                              {formatPrice(p.price)}
                            </div>
                          </div>
                          <button
                            onClick={() => addToCart(p.id)}
                            className="w-full py-1.5 text-[11px] font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded transition-colors"
                          >
                            Add to Manifest
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {/* Overall Benchmark Score */}
                  <tr className="bg-amber-500/5">
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      Overall Lab Score
                    </td>
                    {comparedProducts.map((p) => {
                      const isWinner = p.benchmarks.overallScore === highestBenchmark;
                      return (
                        <td key={p.id} className="py-3 px-4 font-bold text-sm">
                          <div className="flex items-center gap-1.5">
                            <span className={isWinner ? 'text-amber-500' : 'text-slate-800 dark:text-slate-200'}>
                              {p.benchmarks.overallScore}/100
                            </span>
                            {isWinner && <Trophy className="w-3.5 h-3.5 text-amber-500" />}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* TGP Power Limit */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500">Max TGP (Watts)</td>
                    {comparedProducts.map((p) => {
                      const isWinner = p.specs.tgpWatts && p.specs.tgpWatts === highestTgp;
                      return (
                        <td key={p.id} className={`py-3 px-4 ${isWinner ? 'text-emerald-500 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                          {p.specs.tgpWatts ? `${p.specs.tgpWatts}W` : 'N/A'}
                          {isWinner && ' (Highest)'}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Display & Refresh */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500">Display / Refresh</td>
                    {comparedProducts.map((p) => {
                      const isWinner = p.specs.refreshRateHz && p.specs.refreshRateHz === highestRefresh;
                      return (
                        <td key={p.id} className="py-3 px-4 text-slate-700 dark:text-slate-300">
                          <div>{p.specs.display || 'N/A'}</div>
                          {p.specs.refreshRateHz && (
                            <span className={isWinner ? 'text-emerald-500 font-bold' : 'text-slate-500'}>
                              {p.specs.refreshRateHz}Hz {isWinner && '(Peak)'}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Response / Latency */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500">Response / Latency</td>
                    {comparedProducts.map((p) => {
                      const isWinner = p.specs.responseTimeMs && p.specs.responseTimeMs === lowestLatency;
                      return (
                        <td key={p.id} className={`py-3 px-4 ${isWinner ? 'text-emerald-500 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                          {p.specs.responseTimeMs ? `${p.specs.responseTimeMs} ms` : 'N/A'}
                          {isWinner && ' (Fastest)'}
                        </td>
                      );
                    })}
                  </tr>

                  {/* CPU Architecture */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500">Processor (CPU)</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {p.specs.cpu || 'N/A'}
                      </td>
                    ))}
                  </tr>

                  {/* GPU Graphics */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500">Graphics (GPU)</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {p.specs.gpu || 'N/A'}
                      </td>
                    ))}
                  </tr>

                  {/* Memory & Bandwidth */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500">RAM & Bandwidth</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {p.specs.ram || 'N/A'}
                      </td>
                    ))}
                  </tr>

                  {/* Weight */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500">Chassis Weight</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {p.specs.weightKg ? `${p.specs.weightKg} kg` : 'N/A'}
                      </td>
                    ))}
                  </tr>

                  {/* Battery */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500">Battery Endurance</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {p.specs.batteryHours ? `${p.specs.batteryHours} Hours` : 'N/A'}
                      </td>
                    ))}
                  </tr>

                  {/* Expert Verdict */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500">Expert Verdict</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-slate-600 dark:text-slate-400 font-sans text-[11px] leading-relaxed">
                        {p.expertVerdict.verdict}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
