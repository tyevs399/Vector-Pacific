import React, { useState, useMemo } from 'react';
import {
  X,
  Cpu,
  Zap,
  Sliders,
  Download,
  Share2,
  Check,
  TrendingUp,
  TrendingDown,
  Thermometer,
  Volume2,
  Activity,
  Printer,
  Scale,
  RefreshCw,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INDUSTRY_BENCHMARK_BASELINES, SIMULATED_WORKLOADS, IndustryBenchmarkBaseline } from '../../data/benchmarks';
import { Product } from '../../types';

export const BenchmarkSimulatorModal: React.FC = () => {
  const {
    activeModal,
    closeModals,
    products,
    formatPrice,
    simulatorProductId,
    openProductModal,
    addToCart
  } = useApp();

  // Active view tabs
  const [viewMode, setViewMode] = useState<'comparison' | 'stress_simulation' | 'radar'>('comparison');

  // Selected product and baseline
  const [selectedProductId, setSelectedProductId] = useState<string>(
    simulatorProductId || products[0]?.id || 'razer-blade-18-2026'
  );
  const [selectedBaselineId, setSelectedBaselineId] = useState<string>('laptop-mainstream-gaming');

  // Stress simulator variables
  const [selectedWorkloadId, setSelectedWorkloadId] = useState<string>('unreal-8k-render');
  const [ambientTemp, setAmbientTemp] = useState<number>(21); // Ambient °C (16 - 36)
  const [tgpLimit, setTgpLimit] = useState<number>(175); // Watts (65 - 175)
  const [fanProfile, setFanProfile] = useState<'silent' | 'balanced' | 'overclock'>('balanced');
  const [copiedMd, setCopiedMd] = useState(false);

  // Sync if simulatorProductId changes from external click
  React.useEffect(() => {
    if (simulatorProductId) {
      setSelectedProductId(simulatorProductId);
    }
  }, [simulatorProductId]);

  if (activeModal !== 'simulator') return null;

  const currentProduct: Product = products.find((p) => p.id === selectedProductId) || products[0];
  const currentBaseline: IndustryBenchmarkBaseline =
    INDUSTRY_BENCHMARK_BASELINES.find((b) => b.id === selectedBaselineId) || INDUSTRY_BENCHMARK_BASELINES[1];
  const currentWorkload =
    SIMULATED_WORKLOADS.find((w) => w.id === selectedWorkloadId) || SIMULATED_WORKLOADS[0];

  // Helper to calculate score delta %
  const getDelta = (productScore: number, baselineScore: number, higherIsBetter = true) => {
    if (!baselineScore || !productScore) return { percent: 0, text: '0.0%', isBetter: true };
    const diff = productScore - baselineScore;
    const pct = (diff / baselineScore) * 100;
    const isBetter = higherIsBetter ? diff >= 0 : diff <= 0;
    const sign = pct > 0 ? '+' : '';
    return {
      percent: Math.round(pct * 10) / 10,
      text: `${sign}${pct.toFixed(1)}%`,
      isBetter
    };
  };

  // Product benchmark values with fallbacks
  const pGeekbenchMulti = currentProduct.benchmarks.geekbenchMulti || 14500;
  const pGeekbenchSingle = currentProduct.benchmarks.geekbenchSingle || 2800;
  const pCinebenchMulti = currentProduct.benchmarks.cinebench2024 || 1550;
  const pCinebenchSingle = currentProduct.benchmarks.cinebench2024Single || 122;
  const pTimeSpy = currentProduct.benchmarks.timeSpyGraphics || 14000;
  const pLatency = currentProduct.benchmarks.latencyClickMs || 2.0;
  const pNoise = currentProduct.benchmarks.noiseDbaLoad ?? 42.0;
  const pThrottling = currentProduct.benchmarks.thermalThrottlingPercent ?? 2.5;

  // Comparison metrics array
  const comparisonMetrics = [
    {
      label: 'Cinebench 2024 Multi-Core',
      unit: 'pts',
      productVal: pCinebenchMulti,
      baselineVal: currentBaseline.scores.cinebench2024Multi,
      higherIsBetter: true,
      description: 'Sustained 3D rendering throughput in Cinema 4D engine.'
    },
    {
      label: 'Cinebench 2024 Single-Core',
      unit: 'pts',
      productVal: pCinebenchSingle,
      baselineVal: currentBaseline.scores.cinebench2024Single,
      higherIsBetter: true,
      description: 'Peak single-threaded instruction efficiency and boost clock stability.'
    },
    {
      label: 'Geekbench 6 Multi-Core',
      unit: 'pts',
      productVal: pGeekbenchMulti,
      baselineVal: currentBaseline.scores.geekbenchMulti,
      higherIsBetter: true,
      description: 'Synthetic integer, floating-point, and memory subsystem stress.'
    },
    {
      label: 'Geekbench 6 Single-Core',
      unit: 'pts',
      productVal: pGeekbenchSingle,
      baselineVal: currentBaseline.scores.geekbenchSingle,
      higherIsBetter: true,
      description: 'Raw single-core IPC across encryption, ray tracing, and compilation.'
    },
    {
      label: '3DMark Time Spy Graphics',
      unit: 'pts',
      productVal: pTimeSpy,
      baselineVal: currentBaseline.scores.timeSpyGraphics,
      higherIsBetter: true,
      description: 'DirectX 12 rasterization, volumetric illumination, and geometry compute.'
    },
    {
      label: 'Input / Switch Latency',
      unit: 'ms',
      productVal: pLatency,
      baselineVal: currentBaseline.scores.latencyMs,
      higherIsBetter: false,
      description: 'Physical displacement to signal acknowledgment at system layer.'
    },
    {
      label: 'Acoustic Sound Pressure (Full Load)',
      unit: 'dBA',
      productVal: pNoise,
      baselineVal: currentBaseline.scores.acousticNoiseDba,
      higherIsBetter: false,
      description: 'Sound pressure measurement at 50cm operator distance under 100% stress.'
    },
    {
      label: 'Thermal Throttling (60m Sustained)',
      unit: '% lost',
      productVal: pThrottling,
      baselineVal: currentBaseline.scores.thermalThrottlingPercent,
      higherIsBetter: false,
      description: 'Clock degradation delta after a continuous 1-hour stress loop.'
    }
  ];

  // Dynamic Stress Simulator Math
  const simulationResults = useMemo(() => {
    // Base thermal calculation
    const ambientOffset = ambientTemp - 21; // baseline is 21°C lab standard
    const fanCoolingFactor = fanProfile === 'silent' ? -8 : fanProfile === 'balanced' ? 0 : 7;
    const tgpRatio = tgpLimit / (currentProduct.specs.tgpWatts || 140);

    // Calculated Junction Temp
    const estimatedJunctionTemp = Math.round(
      65 + (tgpRatio * 20) + (ambientOffset * 0.9) - fanCoolingFactor
    );

    // Calculate throttling percentage based on temp > 88°C
    let dynamicThrottle = 0;
    if (estimatedJunctionTemp > 95) {
      dynamicThrottle = (estimatedJunctionTemp - 95) * 2.2;
    } else if (estimatedJunctionTemp > 88) {
      dynamicThrottle = (estimatedJunctionTemp - 88) * 0.8;
    }

    // Dynamic Cinebench score based on power & thermal throttling
    const baseCine = pCinebenchMulti;
    const powerAdjustedCine = baseCine * Math.pow(tgpRatio, 0.45);
    const finalSimulatedCinebench = Math.round(powerAdjustedCine * (1 - dynamicThrottle / 100));

    // Dynamic Geekbench score
    const finalSimulatedGeekbench = Math.round(pGeekbenchMulti * Math.pow(tgpRatio, 0.3) * (1 - dynamicThrottle / 150));

    // Workload output (time or fps)
    let workloadOutput = 0;
    if (currentWorkload.id === 'unreal-8k-render') {
      // Lower seconds is faster
      const scale = pCinebenchMulti / finalSimulatedCinebench;
      workloadOutput = Math.round(currentWorkload.baseLoadSeconds * scale);
    } else if (currentWorkload.id === 'cyberpunk-pathtracing-4k') {
      // Higher FPS is better
      const scale = (finalSimulatedCinebench / pCinebenchMulti) * (pTimeSpy / 16000);
      workloadOutput = Math.round(currentWorkload.baseLoadSeconds * scale * 10) / 10;
    } else if (currentWorkload.id === 'llm-inference-70b') {
      const scale = (finalSimulatedGeekbench / pGeekbenchMulti);
      workloadOutput = Math.round(currentWorkload.baseLoadSeconds * scale * 10) / 10;
    } else {
      // Latency in ms
      const scale = 1 + (dynamicThrottle / 100);
      workloadOutput = Math.round(currentWorkload.baseLoadSeconds * scale * 100) / 100;
    }

    // Dynamic noise
    const dynamicNoiseDba =
      fanProfile === 'silent' ? 32.5 : fanProfile === 'balanced' ? 42.0 : 51.5;

    return {
      junctionTemp: estimatedJunctionTemp,
      throttlingPercent: Math.round(dynamicThrottle * 10) / 10,
      simulatedCinebench: finalSimulatedCinebench,
      simulatedGeekbench: finalSimulatedGeekbench,
      workloadOutput,
      noiseDba: dynamicNoiseDba
    };
  }, [ambientTemp, tgpLimit, fanProfile, currentProduct, currentWorkload, pCinebenchMulti, pGeekbenchMulti, pTimeSpy]);

  // Radar Polygon coordinates generator
  const getRadarPoints = (axes: {
    singleCore: number;
    multiCore: number;
    graphicsRaster: number;
    thermalHeadroom: number;
    acousticSilence: number;
    inputResponsiveness: number;
  }) => {
    const center = 150;
    const maxRadius = 110;
    const angles = [
      -Math.PI / 2, // top: Single Core
      -Math.PI / 6, // top right: Multi Core
      Math.PI / 6, // bottom right: Graphics
      Math.PI / 2, // bottom: Input Responsiveness
      (5 * Math.PI) / 6, // bottom left: Acoustic Silence
      (-5 * Math.PI) / 6 // top left: Thermal Headroom
    ];

    const values = [
      axes.singleCore,
      axes.multiCore,
      axes.graphicsRaster,
      axes.inputResponsiveness,
      axes.acousticSilence,
      axes.thermalHeadroom
    ];

    const points = values.map((val, idx) => {
      const r = (val / 100) * maxRadius;
      const x = center + r * Math.cos(angles[idx]);
      const y = center + r * Math.sin(angles[idx]);
      return `${x},${y}`;
    });

    return points.join(' ');
  };

  // Product radar values calculated from its benchmarks
  const productRadarAxes = useMemo(() => {
    const singleCore = Math.min(100, Math.round((pGeekbenchSingle / 4000) * 100));
    const multiCore = Math.min(100, Math.round((pGeekbenchMulti / 25000) * 100));
    const graphicsRaster = Math.min(100, Math.round((pTimeSpy / 36500) * 100));
    const thermalHeadroom = Math.max(30, Math.round(100 - (pThrottling * 4)));
    const acousticSilence = Math.max(30, Math.round(100 - (pNoise - 25) * 2.5));
    const inputResponsiveness = Math.min(100, Math.round(100 - (pLatency * 12)));

    return {
      singleCore,
      multiCore,
      graphicsRaster,
      thermalHeadroom,
      acousticSilence,
      inputResponsiveness
    };
  }, [pGeekbenchSingle, pGeekbenchMulti, pTimeSpy, pThrottling, pNoise, pLatency]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Benchmark Metric', 'Product Score', 'Industry Baseline', 'Delta %', 'Unit'];
    const rows = comparisonMetrics.map((m) => {
      const delta = getDelta(m.productVal, m.baselineVal, m.higherIsBetter);
      return [
        `"${m.label}"`,
        m.productVal,
        m.baselineVal,
        `"${delta.text}"`,
        `"${m.unit}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AetherHardware_Benchmark_Simulation_${currentProduct.slug}_vs_${currentBaseline.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Markdown Table
  const handleCopyMarkdown = () => {
    let md = `### [AetherHardware Benchmark Simulation] ${currentProduct.name} vs ${currentBaseline.name}\n\n`;
    md += `| Benchmark Metric | ${currentProduct.name} | ${currentBaseline.name} | Differential | Unit |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- |\n`;
    comparisonMetrics.forEach((m) => {
      const delta = getDelta(m.productVal, m.baselineVal, m.higherIsBetter);
      md += `| **${m.label}** | ${m.productVal.toLocaleString()} | ${m.baselineVal.toLocaleString()} | ${delta.text} | ${m.unit} |\n`;
    });
    md += `\n*Simulated under ISO-calibrated thermal chamber conditions with calibrated acoustic meters.*`;

    navigator.clipboard?.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  Silicon Simulation Lab: Benchmark Differential Engine
                </h2>
                <span className="hidden sm:inline-block text-[11px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  Live Mathematical Model
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans">
                Simulate workloads and visualize differentials against standard industry baselines (Cinebench, Geekbench, TimeSpy)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:text-amber-500 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-amber-500/40 transition-colors flex items-center gap-1.5"
              title="Export CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:text-amber-500 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-amber-500/40 transition-colors flex items-center gap-1.5"
              title="Copy Markdown Table"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedMd ? 'Copied!' : 'Reddit MD'}</span>
            </button>

            <button
              onClick={closeModals}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode Segmented Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 text-xs font-mono overflow-x-auto">
          <button
            onClick={() => setViewMode('comparison')}
            className={`pb-3 px-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
              viewMode === 'comparison'
                ? 'border-amber-500 text-amber-500 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Spec vs Industry Baseline Differentials
          </button>

          <button
            onClick={() => setViewMode('stress_simulation')}
            className={`pb-3 px-2 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              viewMode === 'stress_simulation'
                ? 'border-amber-500 text-amber-500 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Stress & Thermal Simulator</span>
          </button>

          <button
            onClick={() => setViewMode('radar')}
            className={`pb-3 px-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
              viewMode === 'radar'
                ? 'border-amber-500 text-amber-500 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Multi-Axis Radar Spider Analysis
          </button>
        </div>

        {/* Product & Baseline Configuration Bar */}
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          {/* Target Product Selector */}
          <div>
            <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1.5 flex items-center justify-between">
              <span>TARGET HARDWARE PRODUCT</span>
              <span className="text-amber-500 font-bold tabular-nums">
                {formatPrice(currentProduct.price)}
              </span>
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-[#121722] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-medium"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand} {p.name} ({p.specs.cpu || p.specs.switchType || p.category})
                </option>
              ))}
            </select>
          </div>

          {/* Industry Baseline Selector */}
          <div>
            <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1.5 flex items-center justify-between">
              <span>INDUSTRY BENCHMARK BASELINE</span>
              <span className="text-slate-600 dark:text-slate-300">Certified Standard</span>
            </label>
            <select
              value={selectedBaselineId}
              onChange={(e) => setSelectedBaselineId(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-[#121722] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-medium"
            >
              {INDUSTRY_BENCHMARK_BASELINES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* VIEW 1: Benchmark Differentials Grid */}
          {viewMode === 'comparison' && (
            <div className="space-y-6">
              
              {/* Baseline Context Kicker */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-600 dark:text-slate-300 block text-[11px]">ACTIVE BASELINE REFERENCE HARDWARE</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {currentBaseline.name}
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-sans mt-0.5">
                    {currentBaseline.hardwareSummary}
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => openProductModal(currentProduct.id)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors whitespace-nowrap"
                  >
                    Inspect Full Specs
                  </button>
                  <button
                    onClick={() => addToCart(currentProduct.id)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors whitespace-nowrap"
                  >
                    Add to Manifest
                  </button>
                </div>
              </div>

              {/* Differential Comparison Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comparisonMetrics.map((metric, idx) => {
                  const delta = getDelta(metric.productVal, metric.baselineVal, metric.higherIsBetter);
                  const maxVal = Math.max(metric.productVal, metric.baselineVal) * 1.15;
                  const productBarWidth = Math.min(100, (metric.productVal / maxVal) * 100);
                  const baselineBarWidth = Math.min(100, (metric.baselineVal / maxVal) * 100);

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 space-y-3"
                    >
                      {/* Metric Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                            {metric.label}
                          </h4>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 font-sans leading-snug mt-0.5">
                            {metric.description}
                          </p>
                        </div>

                        {/* Delta Badge (Zero pill: unboxed bold font with arrow) */}
                        <div className={`font-mono text-xs font-bold shrink-0 flex items-center gap-1 ${
                          delta.isBetter ? 'text-emerald-500' : 'text-rose-500'
                        }`}>
                          {delta.isBetter ? (
                            <TrendingUp className="w-3.5 h-3.5" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5" />
                          )}
                          <span>{delta.text}</span>
                        </div>
                      </div>

                      {/* Side by side numerical readout */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                        <div className="space-y-1">
                          <span className="text-[10px] text-amber-500 uppercase font-bold block truncate">
                            {currentProduct.brand} (Target)
                          </span>
                          <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                            {metric.productVal.toLocaleString()} <span className="text-[10px] text-slate-600 dark:text-slate-300 font-normal">{metric.unit}</span>
                          </span>
                          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div
                              style={{ width: `${productBarWidth}%` }}
                              className="h-full bg-amber-500 rounded-full transition-all duration-300"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-600 dark:text-slate-300 uppercase font-bold block truncate">
                            Baseline
                          </span>
                          <span className="text-base font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                            {metric.baselineVal.toLocaleString()} <span className="text-[10px] text-slate-600 dark:text-slate-300 font-normal">{metric.unit}</span>
                          </span>
                          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div
                              style={{ width: `${baselineBarWidth}%` }}
                              className="h-full bg-slate-400 dark:bg-slate-600 rounded-full transition-all duration-300"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Natural Language Summary Verdict */}
              <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-500 uppercase">
                  <Trophy className="w-4 h-4" />
                  <span>SIMULATION SYNTHESIS & LAB VERDICT</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  Comparing <strong>{currentProduct.name}</strong> against the <strong>{currentBaseline.name}</strong> reveals a sustained throughput differential of{' '}
                  <span className="text-amber-500 font-mono font-bold">
                    {getDelta(pCinebenchMulti, currentBaseline.scores.cinebench2024Multi).text} in Cinebench 2024
                  </span>{' '}
                  and{' '}
                  <span className="text-amber-500 font-mono font-bold">
                    {getDelta(pGeekbenchMulti, currentBaseline.scores.geekbenchMulti).text} in Geekbench 6 Multi-Core
                  </span>
                  . Under maximum graphics load, Time Spy registers at {pTimeSpy.toLocaleString()} pts vs {currentBaseline.scores.timeSpyGraphics.toLocaleString()} pts.
                </p>
              </div>

            </div>
          )}

          {/* VIEW 2: Interactive Real-Time Stress & Thermal Simulator */}
          {viewMode === 'stress_simulation' && (
            <div className="space-y-6">
              
              {/* Simulator Description Banner */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/30 space-y-2">
                <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-500" />
                  <span>Real-Time Thermal Dissipation & Clock Stability Model</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Adjust simulated environmental variables (ambient room temperature, maximum TGP wattage, fan curve profile) to observe how vapor chamber dissipation affects sustained Cinebench 2024 render scores, junction temperatures, and frame rates.
                </p>
              </div>

              {/* Simulator Controls & Sliders */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121724] space-y-5 text-xs font-mono">
                
                {/* Workload Selector */}
                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-2">
                    SIMULATED WORKLOAD STRESS PROFILE
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {SIMULATED_WORKLOADS.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => setSelectedWorkloadId(w.id)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedWorkloadId === w.id
                            ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <span className="text-[10px] text-slate-600 dark:text-slate-300 block uppercase">
                          {w.category} (Load {w.stressIntensity}/10)
                        </span>
                        <span className="text-xs block mt-0.5 line-clamp-1">{w.name}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-sans mt-2">
                    {currentWorkload.description}
                  </p>
                </div>

                {/* Slider 1: Ambient Temperature */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                      <Thermometer className="w-4 h-4 text-amber-500" />
                      <span>Ambient Room Chamber Temperature:</span>
                    </span>
                    <span className="font-bold text-amber-500 text-sm tabular-nums">
                      {ambientTemp}°C ({Math.round(ambientTemp * 1.8 + 32)}°F)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="38"
                    step="1"
                    value={ambientTemp}
                    onChange={(e) => setAmbientTemp(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-300">
                    <span>16°C (Climate-Controlled Lab)</span>
                    <span>21°C (Standard ISO Ambient)</span>
                    <span>28°C (Warm Summer Room)</span>
                    <span>38°C (Extreme Desert Chamber)</span>
                  </div>
                </div>

                {/* Slider 2: Power Limit TGP */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Configurable Power Limit / Max TGP:</span>
                    </span>
                    <span className="font-bold text-amber-500 text-sm tabular-nums">
                      {tgpLimit} Watts
                    </span>
                  </div>
                  <input
                    type="range"
                    min="65"
                    max="175"
                    step="5"
                    value={tgpLimit}
                    onChange={(e) => setTgpLimit(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-300">
                    <span>65W (Efficiency Profile)</span>
                    <span>115W (Thin & Light Cap)</span>
                    <span>140W (Standard Boost)</span>
                    <span>175W (Full Desktop Replacement TGP)</span>
                  </div>
                </div>

                {/* Fan Curve Profile */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-amber-500" />
                    <span>Fan Curve & Acoustic Profile:</span>
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'silent', label: 'Whisper Silent', rpm: '1,400 RPM · ~32.5 dBA' },
                      { id: 'balanced', label: 'Balanced Curve', rpm: '2,900 RPM · ~42.0 dBA' },
                      { id: 'overclock', label: 'Aggressive Turbo', rpm: '4,800 RPM · ~51.5 dBA' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFanProfile(f.id as any)}
                        className={`p-2.5 rounded-lg border text-left transition-colors ${
                          fanProfile === f.id
                            ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <span className="text-xs block">{f.label}</span>
                        <span className="text-[10px] text-slate-600 dark:text-slate-300 font-normal">{f.rpm}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Dynamic Real-Time Simulation Telemetry Outputs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Simulated Cinebench 2024 Score */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-1">
                  <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300 block">SIMULATED CINEBENCH 2024</span>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                    {simulationResults.simulatedCinebench.toLocaleString()} pts
                  </div>
                  <span className={`text-[10px] font-mono ${
                    simulationResults.simulatedCinebench >= pCinebenchMulti ? 'text-emerald-500' : 'text-amber-500'
                  }`}>
                    {simulationResults.simulatedCinebench >= pCinebenchMulti ? 'Peak sustained boost' : 'Thermal power constrained'}
                  </span>
                </div>

                {/* Junction Temperature with Warning Indicator */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-1">
                  <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300 block">PEAK JUNCTION TEMP</span>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums flex items-center gap-1.5">
                    <span>{simulationResults.junctionTemp}°C</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      simulationResults.junctionTemp < 78
                        ? 'bg-emerald-500'
                        : simulationResults.junctionTemp < 88
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300">
                    {simulationResults.junctionTemp < 78 ? 'Optimal headroom' : simulationResults.junctionTemp < 88 ? 'Warm normal range' : 'Thermal throttling zone'}
                  </span>
                </div>

                {/* Simulated Workload Metric */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-1">
                  <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300 block truncate">{currentWorkload.metricLabel}</span>
                  <div className="text-xl font-bold font-mono text-amber-500 tabular-nums">
                    {simulationResults.workloadOutput} {currentWorkload.targetUnit.split(' ')[0]}
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300">
                    {currentWorkload.targetUnit}
                  </span>
                </div>

                {/* Throttling Degradation Delta */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-1">
                  <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300 block">THERMAL THROTTLE DELTA</span>
                  <div className={`text-xl font-bold font-mono tabular-nums ${
                    simulationResults.throttlingPercent === 0 ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                    {simulationResults.throttlingPercent === 0 ? '0.0% (Zero Throttling)' : `-${simulationResults.throttlingPercent}%`}
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300">
                    Acoustics: ~{simulationResults.noiseDba} dBA
                  </span>
                </div>

              </div>

              {/* 60-Second Simulated Clock Pacing Graph */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121724] space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-900 dark:text-white uppercase">
                    SIMULATED 60-SECOND SUSTAINED STRESS LOOP
                  </span>
                  <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                    Frequency (GHz) vs Time
                  </span>
                </div>

                {/* Simulated Chart Bars */}
                <div className="h-32 flex items-end justify-between gap-1 pt-4 border-b border-slate-100 dark:border-slate-800 px-2">
                  {Array.from({ length: 24 }).map((_, i) => {
                    // Clock speed decays if throttling occurs over time
                    const timeProgress = i / 24;
                    const throttleLoss = simulationResults.throttlingPercent * timeProgress;
                    const heightPercent = Math.max(35, 95 - throttleLoss * 2.5);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t transition-all duration-300 ${
                            simulationResults.throttlingPercent > 5 && i > 12
                              ? 'bg-rose-500/80 group-hover:bg-rose-400'
                              : 'bg-amber-500/80 group-hover:bg-amber-400'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-300 pt-1">
                  <span>0s (Initial Turbo Boost)</span>
                  <span>30s (Thermal Equilibrium)</span>
                  <span>60s (Sustained Clock Rate)</span>
                </div>
              </div>

            </div>
          )}

          {/* VIEW 3: Multi-Axis Radar Spider Analysis */}
          {viewMode === 'radar' && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/30 space-y-1 text-xs">
                <h3 className="font-mono font-bold text-slate-900 dark:text-white uppercase">
                  Hexagonal Benchmark Radar Differential
                </h3>
                <p className="text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Normalized 6-axis performance comparison mapping Single-Core instruction throughput, Multi-Core rendering compute, 3D Raster Graphics, Thermal Headroom, Acoustic Silence, and Input Latency responsiveness.
                </p>
              </div>

              {/* Spider Chart SVG + Legend */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* SVG Radar Chart */}
                <div className="md:col-span-7 flex justify-center p-4">
                  <svg width="300" height="300" viewBox="0 0 300 300" className="overflow-visible">
                    {/* Concentric Reference Polygons (20%, 40%, 60%, 80%, 100%) */}
                    {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, i) => {
                      const maxR = 110;
                      const r = scale * maxR;
                      const angles = [-Math.PI / 2, -Math.PI / 6, Math.PI / 6, Math.PI / 2, (5 * Math.PI) / 6, (-5 * Math.PI) / 6];
                      const pts = angles.map((a) => `${150 + r * Math.cos(a)},${150 + r * Math.sin(a)}`).join(' ');
                      return (
                        <polygon
                          key={i}
                          points={pts}
                          fill="none"
                          stroke="currentColor"
                          className="text-slate-200 dark:text-slate-800"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Radial Axis Spokes */}
                    {[-Math.PI / 2, -Math.PI / 6, Math.PI / 6, Math.PI / 2, (5 * Math.PI) / 6, (-5 * Math.PI) / 6].map((a, i) => (
                      <line
                        key={i}
                        x1="150"
                        y1="150"
                        x2={150 + 110 * Math.cos(a)}
                        y2={150 + 110 * Math.sin(a)}
                        stroke="currentColor"
                        className="text-slate-200 dark:text-slate-800"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Baseline Polygon (Muted Slate) */}
                    <polygon
                      points={getRadarPoints(currentBaseline.radarAxes)}
                      fill="rgba(148, 163, 184, 0.25)"
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />

                    {/* Product Polygon (Amber Accent) */}
                    <polygon
                      points={getRadarPoints(productRadarAxes)}
                      fill="rgba(245, 158, 11, 0.35)"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                    />

                    {/* Labels */}
                    <text x="150" y="24" textAnchor="middle" className="text-[10px] font-mono fill-slate-600 dark:fill-slate-300">Single-Core</text>
                    <text x="270" y="90" textAnchor="start" className="text-[10px] font-mono fill-slate-600 dark:fill-slate-300">Multi-Core</text>
                    <text x="270" y="220" textAnchor="start" className="text-[10px] font-mono fill-slate-600 dark:fill-slate-300">3D Raster</text>
                    <text x="150" y="284" textAnchor="middle" className="text-[10px] font-mono fill-slate-600 dark:fill-slate-300">Input Response</text>
                    <text x="30" y="220" textAnchor="end" className="text-[10px] font-mono fill-slate-600 dark:fill-slate-300">Acoustic Silence</text>
                    <text x="30" y="90" textAnchor="end" className="text-[10px] font-mono fill-slate-600 dark:fill-slate-300">Thermal Headroom</text>
                  </svg>
                </div>

                {/* Radar Breakdown & Legend */}
                <div className="md:col-span-5 space-y-4 text-xs font-mono">
                  
                  {/* Legend */}
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded bg-amber-500 shrink-0" />
                      <span className="font-bold text-slate-900 dark:text-white truncate">
                        {currentProduct.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded bg-slate-400 dark:bg-slate-600 shrink-0" />
                      <span className="text-slate-600 dark:text-slate-400 truncate">
                        {currentBaseline.name}
                      </span>
                    </div>
                  </div>

                  {/* Quantitative Scores */}
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Single-Core IPC:</span>
                      <span className="font-bold text-amber-500 tabular-nums">{productRadarAxes.singleCore}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Multi-Core Throughput:</span>
                      <span className="font-bold text-amber-500 tabular-nums">{productRadarAxes.multiCore}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">3D Graphics Raster:</span>
                      <span className="font-bold text-amber-500 tabular-nums">{productRadarAxes.graphicsRaster}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Thermal Headroom:</span>
                      <span className="font-bold text-amber-500 tabular-nums">{productRadarAxes.thermalHeadroom}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Acoustic Silence:</span>
                      <span className="font-bold text-amber-500 tabular-nums">{productRadarAxes.acousticSilence}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Input Response Speed:</span>
                      <span className="font-bold text-amber-500 tabular-nums">{productRadarAxes.inputResponsiveness}/100</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-500">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>ISO-Standard Synthetic & Real-World Simulation Engine v2026.4</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => openProductModal(currentProduct.id)}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors whitespace-nowrap"
            >
              Inspect Product Page
            </button>
            <button
              onClick={() => {
                addToCart(currentProduct.id);
                closeModals();
              }}
              className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors whitespace-nowrap shadow-sm"
            >
              Add {currentProduct.name} to Manifest
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
