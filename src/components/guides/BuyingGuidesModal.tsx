import React, { useState } from 'react';
import { X, BookOpen, Calculator, Cpu, Monitor, Zap, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BuyingGuidesModal: React.FC = () => {
  const { activeModal, closeModals, openProductModal, setActiveModal } = useApp();

  const [activeTab, setActiveTab] = useState<'guides' | 'calculators'>('guides');

  // Calculator states
  const [selectedGpuTgp, setSelectedGpuTgp] = useState<number>(175);
  const [selectedCpuTdp, setSelectedCpuTdp] = useState<number>(65);
  const [monitorCount, setMonitorCount] = useState<number>(2);

  const [displayDiagonal, setDisplayDiagonal] = useState<number>(31.5);
  const [displayResWidth, setDisplayResWidth] = useState<number>(3840);
  const [displayResHeight, setDisplayResHeight] = useState<number>(2160);

  if (activeModal !== 'guides') return null;

  // Wattage calculation
  const totalEstimatedWatts = selectedGpuTgp + selectedCpuTdp + (monitorCount * 25) + 60; // 60W for motherboard, RAM, NVMe
  const recommendedPsuWatts = Math.ceil((totalEstimatedWatts * 1.3) / 50) * 50;

  // PPI calculation
  const ppi = Math.round(
    Math.sqrt(Math.pow(displayResWidth, 2) + Math.pow(displayResHeight, 2)) / displayDiagonal
  );
  const optimalViewingDistanceCm = Math.round((3438 / ppi) * 2.54);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                Enthusiast Buying Guides & Hardware Calculators
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Authored by lab test engineers and competitive hardware overclockers
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

        {/* Tab switcher */}
        <div className="flex items-center gap-3 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('guides')}
            className={`pb-3 px-2 border-b-2 font-medium transition-colors ${
              activeTab === 'guides'
                ? 'border-amber-500 text-amber-500 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Architectural Buying Guides
          </button>
          <button
            onClick={() => setActiveTab('calculators')}
            className={`pb-3 px-2 border-b-2 font-medium transition-colors ${
              activeTab === 'calculators'
                ? 'border-amber-500 text-amber-500 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Power & Display Calculators
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* TAB 1: In-depth Buying Guides */}
          {activeTab === 'guides' && (
            <div className="space-y-6">
              
              {/* Article 1 */}
              <article className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span className="text-amber-500 font-bold uppercase">FLAGSHIP LAPTOPS</span>
                  <span>·</span>
                  <span>12 min read</span>
                  <span>·</span>
                  <span>Updated for 2026</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  175W Full TGP vs Thin-and-Light: Understanding Laptop Thermal Throttling
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  Not all RTX 4090 laptop chips perform identically. A 175W power-limit laptop like the Razer Blade 18 delivers up to 34% higher sustained 3D frame rates than a thin 115W chassis under 2+ hours of continuous gaming. If your workflow involves 8K Unreal 5 rendering or high-FPS 4K ray tracing, thermal volume and vapor chamber cooling loops take precedence over raw weight.
                </p>
                <div className="flex items-center gap-3 pt-2 text-xs font-mono">
                  <button
                    onClick={() => openProductModal('razer-blade-18-2026')}
                    className="text-amber-500 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Inspect 175W Razer Blade 18</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>

              {/* Article 2 */}
              <article className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span className="text-amber-500 font-bold uppercase">MAGNETIC SWITCHES</span>
                  <span>·</span>
                  <span>8 min read</span>
                  <span>·</span>
                  <span>Esports Input Physics</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Why Hall Effect & 0.1mm Rapid Trigger Render Traditional Mechanical Switches Obsolete
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  Traditional mechanical switches rely on metallic leaf contacts that require debouncing algorithms (5ms to 15ms latency delay) and fixed physical reset points. Hall effect keyboards measure magnetic flux continuously, resetting the key the instant you lift your finger by even 0.1mm. For counter-strafing in tactical shooters, this eliminates physical dead zones.
                </p>
                <div className="flex items-center gap-3 pt-2 text-xs font-mono">
                  <button
                    onClick={() => openProductModal('wooting-80he-rapid-trigger')}
                    className="text-amber-500 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Inspect Wooting 80HE Magnetic Board</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>

              {/* Article 3 */}
              <article className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span className="text-amber-500 font-bold uppercase">DISPLAY PANELS</span>
                  <span>·</span>
                  <span>10 min read</span>
                  <span>·</span>
                  <span>Optics & Calibration</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  QD-OLED vs Mini-LED: Pixel Response, Burn-in Mitigation, and Text Clarity
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  Third-generation QD-OLED provides instantaneous 0.03ms pixel response with zero halo blooming around bright crosshairs. Mini-LED excels in sustained full-screen 1000+ nits brightness and zero risk of static burn-in for financial traders. For dark-room gaming, QD-OLED remains our editorial choice.
                </p>
                <div className="flex items-center gap-3 pt-2 text-xs font-mono">
                  <button
                    onClick={() => openProductModal('asus-rog-swift-pg32ucdm')}
                    className="text-amber-500 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Inspect ROG PG32UCDM QD-OLED</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>

            </div>
          )}

          {/* TAB 2: Hardware Calculators */}
          {activeTab === 'calculators' && (
            <div className="space-y-6">
              
              {/* Calculator 1: PSU Wattage & TGP Load Estimator */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-500">
                  <Zap className="w-4 h-4" />
                  <span>TOTAL SYSTEM TGP & PSU WATTAGE ESTIMATOR</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <label className="text-slate-500 block mb-1">GPU TGP TARGET</label>
                    <select
                      value={selectedGpuTgp}
                      onChange={(e) => setSelectedGpuTgp(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value={175}>175W (Desktop-Replacement RTX 4090)</option>
                      <option value={140}>140W (RTX 4080 Standard)</option>
                      <option value={115}>115W (Thin-and-Light RTX 4090)</option>
                      <option value={85}>85W (Apple M4 Max GPU Core)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-500 block mb-1">CPU CONTINUOUS TDP</label>
                    <select
                      value={selectedCpuTdp}
                      onChange={(e) => setSelectedCpuTdp(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value={65}>65W (i9-14900HX Sustained PL1)</option>
                      <option value={55}>55W (Core Ultra 9 285H)</option>
                      <option value={35}>35W (Ryzen 9 Mobile)</option>
                      <option value={30}>30W (Apple Silicon CPU)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-500 block mb-1">EXTERNAL DISPLAYS</label>
                    <select
                      value={monitorCount}
                      onChange={(e) => setMonitorCount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value={1}>1 External Monitor</option>
                      <option value={2}>2 External 4K Monitors</option>
                      <option value={3}>3 Displays (Triple Head)</option>
                    </select>
                  </div>
                </div>

                {/* Calculation Output */}
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">TOTAL PEAK SYSTEM DRAW</span>
                    <span className="text-lg font-bold text-slate-100 tabular-nums">~{totalEstimatedWatts} Watts</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">RECOMMENDED POWER BRICK / PSU</span>
                    <span className="text-lg font-bold text-amber-400 tabular-nums">{recommendedPsuWatts}W GaN Certified</span>
                  </div>
                </div>
              </div>

              {/* Calculator 2: PPI & Optimal Viewing Distance */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-500">
                  <Monitor className="w-4 h-4" />
                  <span>PIXEL DENSITY (PPI) & RETINA VIEWING DISTANCE</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <label className="text-slate-500 block mb-1">DIAGONAL SIZE (INCHES)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={displayDiagonal}
                      onChange={(e) => setDisplayDiagonal(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 block mb-1">HORIZONTAL RESOLUTION</label>
                    <input
                      type="number"
                      value={displayResWidth}
                      onChange={(e) => setDisplayResWidth(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 block mb-1">VERTICAL RESOLUTION</label>
                    <input
                      type="number"
                      value={displayResHeight}
                      onChange={(e) => setDisplayResHeight(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Output */}
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">PIXEL DENSITY</span>
                    <span className="text-lg font-bold text-slate-100 tabular-nums">{ppi} PPI</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">MINIMUM RETINA RESOLUTION DISTANCE</span>
                    <span className="text-lg font-bold text-amber-400 tabular-nums">{optimalViewingDistanceCm} cm ({Math.round(optimalViewingDistanceCm / 2.54)} inches)</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
