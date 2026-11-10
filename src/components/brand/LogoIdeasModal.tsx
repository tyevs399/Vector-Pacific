import React, { useState } from 'react';
import { X, Check, Copy, Download, Sparkles, Layers, Shield, Laptop, Terminal } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LogoIdeasModal: React.FC = () => {
  const { activeModal, closeModals } = useApp();

  const [activeConcept, setActiveConcept] = useState<'wave_chevron' | 'chip_lattice' | 'monoline'>('wave_chevron');
  const [copiedSvg, setCopiedSvg] = useState(false);

  if (activeModal !== 'logo_suite') return null;

  const handleCopySvg = () => {
    const svgCode = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L2 14H8L12 8L16 14H22L12 2Z" fill="#F59E0B" />
  <path d="M4 18C8 14 16 14 20 18" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" />
</svg>`;
    navigator.clipboard?.writeText(svgCode);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2000);
  };

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
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                Vector Pacific: Brand Identity & Logo Suite
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Curated visual marks and geometric emblems tailored for West Coast enthusiast hardware
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

        {/* Concept Selector Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 text-xs font-mono overflow-x-auto">
          {[
            { id: 'wave_chevron', label: 'Concept 1: Pacific Vector (Wave & Diamond)' },
            { id: 'chip_lattice', label: 'Concept 2: Silicon Trace (Chip & Velocity Arrow)' },
            { id: 'monoline', label: 'Concept 3: Minimalist Monoline Vector (SVG Mark)' }
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveConcept(c.id as any)}
              className={`pb-3 px-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeConcept === c.id
                  ? 'border-amber-500 text-amber-500 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* CONCEPT 1: Pacific Wave & Diamond Chevron */}
          {activeConcept === 'wave_chevron' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-64 h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-black">
                  <img
                    src="/src/assets/images/logo_vector_pacific_monomark_1794347206773.jpg"
                    alt="Vector Pacific Wave and Diamond Chevron Logo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 p-2 bg-slate-950/80 backdrop-blur-md rounded-lg text-center text-[10px] font-mono text-slate-300">
                    Precision Brushed Bronze & Matte Diamond
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 space-y-4 text-xs font-sans">
                <div className="space-y-1 font-mono">
                  <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                    RECOMMENDED FLAGSHIP EMBLEM
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    The Pacific Vector Monomark
                  </h3>
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>Concept Rationale:</strong> Merges a precision geometric diamond vector frame with an aerodynamic Pacific ocean swell in aerospace-grade brushed bronze. It directly honors the West Coast coastline while the sharp, 45-degree angled chevron communicates zero-latency forward momentum.
                </p>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-2 font-mono text-[11px]">
                  <span className="text-slate-500 block font-semibold uppercase">BEST APPLIED TO:</span>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                    <li>Laser-etched unibody chassis badges (laptops & GPU backplates)</li>
                    <li>Packaging wax seals & custom box foil embossing</li>
                    <li>High-resolution website favicon & app identity</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* CONCEPT 2: Silicon Trace Vector Arrow */}
          {activeConcept === 'chip_lattice' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-64 h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-black">
                  <img
                    src="/src/assets/images/logo_vector_pacific_chip_1794347207141.jpg"
                    alt="Vector Pacific Silicon Chip Lattice Logo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 p-2 bg-slate-950/80 backdrop-blur-md rounded-lg text-center text-[10px] font-mono text-slate-300">
                    Semiconductor Trace Lattice with Amber Accent
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 space-y-4 text-xs font-sans">
                <div className="space-y-1 font-mono">
                  <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                    TECHNICAL HARDWARE INSIGNIA
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    The Silicon Trace Vector
                  </h3>
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>Concept Rationale:</strong> An angled high-velocity arrow ascending across an authenticated microchip PCB trace bus. The gold-anodized traces represent signal integrity and high-bandwidth bus lanes, speaking directly to power users who care about PCB layouts and binned silicon.
                </p>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-2 font-mono text-[11px]">
                  <span className="text-slate-500 block font-semibold uppercase">BEST APPLIED TO:</span>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                    <li>Motherboard and GPU PCB silkscreens</li>
                    <li>Certified benchmark verification watermarks</li>
                    <li>Custom keyboard artisan keycaps and desk mat centerpieces</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* CONCEPT 3: Minimalist Monoline Geometric Vector */}
          {activeConcept === 'monoline' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 flex justify-center">
                <div className="w-64 h-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#090d14] flex flex-col items-center justify-center p-6 space-y-4 shadow-2xl">
                  {/* Clean SVG Logo */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 15l8-8 8 8" />
                      <path d="M12 7v13" />
                      <circle cx="12" cy="7" r="1.5" fill="currentColor" />
                    </svg>
                  </div>

                  <div className="text-center font-mono">
                    <span className="text-base font-extrabold tracking-widest text-white block">
                      VECTOR
                    </span>
                    <span className="text-xs text-amber-400 font-medium tracking-widest block">
                      PACIFIC
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 space-y-4 text-xs font-sans">
                <div className="space-y-1 font-mono">
                  <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                    DIGITAL & WEB VECTOR IDENTITY
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Minimalist Monoline Geometric Vector
                  </h3>
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>Concept Rationale:</strong> Ultra-clean scalable vector lines engineered for crisp rendering on high-DPI displays. Uses clean directional geometry without unnecessary ornamentation, ensuring maximum legibility at tiny 16px favicon scales and responsive top bar headers.
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleCopySvg}
                    className="px-4 py-2 text-xs font-mono font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors flex items-center gap-1.5"
                  >
                    {copiedSvg ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSvg ? 'SVG Code Copied!' : 'Copy Vector SVG Code'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Palette & Typography Tokens Grid */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-500">
              VECTOR PACIFIC DESIGN TOKENS
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-1.5">
                <div className="w-full h-8 rounded bg-[#0b0f17] border border-slate-700" />
                <span className="font-bold text-slate-900 dark:text-white block">Pacific Obsidian</span>
                <span className="text-[10px] text-slate-500">#0B0F17 · Canvas (60%)</span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-1.5">
                <div className="w-full h-8 rounded bg-[#f59e0b]" />
                <span className="font-bold text-slate-900 dark:text-white block">Vector Amber</span>
                <span className="text-[10px] text-slate-500">#F59E0B · Accent (10%)</span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-1.5">
                <div className="w-full h-8 rounded bg-[#101522] border border-slate-700" />
                <span className="font-bold text-slate-900 dark:text-white block">Titanium Surface</span>
                <span className="text-[10px] text-slate-500">#101522 · Surface (30%)</span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-1.5">
                <div className="w-full h-8 rounded bg-[#94a3b8]" />
                <span className="font-bold text-slate-900 dark:text-white block">Aerospace Slate</span>
                <span className="text-[10px] text-slate-500">#94A3B8 · Text Muted</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
