import React from 'react';
import { ChevronRight, Cpu, Zap, Activity, ArrowUpRight, Scale } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Hero: React.FC = () => {
  const { products, formatPrice, addToCart, openProductModal, openSimulatorModal, toggleCompare, isInCompare, t } = useApp();
  const flagship = products[0]; // Razer Blade 18 Flagship

  if (!flagship) return null;

  return (
    <section className="relative pt-6 pb-14 border-b border-slate-200 dark:border-slate-800/80 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#0b0f17] dark:via-[#0e1420] dark:to-[#0b0f17] transition-colors overflow-hidden">
      {/* Background ambient technical grid line */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Split Hero: 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Technical Narrative & Direct Action */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Unboxed Metadata Header (No pills, quiet editorial kicker) */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className="text-amber-500 font-semibold tracking-wider uppercase">2026 BENCHMARK SHOWCASE</span>
              <span aria-hidden="true">·</span>
              <span>175W MAX TGP ARCHITECTURE</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-500 font-medium">NV-01 WAREHOUSE DISPATCH</span>
            </div>

            {/* Headline with balanced wrap */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] [text-wrap:balance]">
              Ultra-Rigid Desktop Power. Engineered for Power Users.
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
              Direct access to authenticated, unthrottled hardware. Inspect deep silicon specifications, benchmark thermal dissipation, and track live global stock across Tokyo, Frankfurt, and Nevada hubs.
            </p>

            {/* Key Hardware Specs Ribbon (Tabular, clean typography) */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-600 dark:text-slate-300 block font-mono text-[11px]">PROCESSOR TGP</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono text-sm tabular-nums">175W Full Boost</span>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-300 block font-mono text-[11px]">DISPLAY MATRIX</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono text-sm">4K 200Hz / FHD 440Hz</span>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-300 block font-mono text-[11px]">COOLING LOOP</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono text-sm">3x Vapor Exhaust</span>
              </div>
            </div>

            {/* Price & Primary Purchase / Spec CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <div className="mr-2">
                <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300 block">BASE CONFIGURATION</span>
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  {formatPrice(flagship.price)}
                </span>
              </div>

              <button
                onClick={() => openProductModal(flagship.id)}
                className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-2 shadow-sm font-mono whitespace-nowrap"
              >
                <span>Inspect Technical Specs</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openSimulatorModal(flagship.id)}
                className="px-4 py-2.5 text-xs font-semibold text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors flex items-center gap-2 font-mono whitespace-nowrap"
              >
                <Activity className="w-4 h-4" />
                <span>Simulate Benchmarks</span>
              </button>

              <button
                onClick={() => addToCart(flagship.id)}
                className="px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 whitespace-nowrap"
              >
                {t('add_to_cart')}
              </button>
            </div>
          </div>

          {/* Right Column: High-Fidelity Product Showcase Image */}
          <div className="lg:col-span-6">
            <div 
              onClick={() => openProductModal(flagship.id)}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900/40 shadow-2xl cursor-pointer"
            >
              <img
                src={flagship.image}
                alt={flagship.name}
                referrerPolicy="no-referrer"
                className="w-full aspect-[16/10] object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              
              {/* Subtle glass telemetry overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent flex items-center justify-between text-xs font-mono text-slate-300">
                <div className="flex items-center gap-3">
                  <span className="text-amber-400 font-semibold">{flagship.brand}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-300">{flagship.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-emerald-400">{flagship.stockCount} in stock</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column KPI Trust Strip below hero split (§1.C & 1.H) */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-amber-500" />
              <span>UNTHROTTLED SILICON</span>
            </div>
            <p className="text-slate-900 dark:text-white font-semibold font-mono text-sm tabular-nums">
              100% Verified TGP
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
              Every unit tested for full continuous boost TDP without BIOS power-limiting.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>RAPID INPUT SAMPLING</span>
            </div>
            <p className="text-slate-900 dark:text-white font-semibold font-mono text-sm tabular-nums">
              8000Hz True Polling
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
              Hall effect magnetic switches and native sub-0.15ms click latency.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              <span>REAL-TIME INVENTORY</span>
            </div>
            <p className="text-slate-900 dark:text-white font-semibold font-mono text-sm tabular-nums">
              Live Warehouse Telemetry
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
              Direct SKU synchronization with Nevada, Frankfurt, and Tokyo fulfillment centers.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
              <Scale className="w-3.5 h-3.5 text-amber-500" />
              <span>MULTI-CURRENCY LEDGER</span>
            </div>
            <p className="text-slate-900 dark:text-white font-semibold font-mono text-sm tabular-nums">
              6 Real-Time Currencies
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
              Instant conversion in USD, EUR, GBP, JPY, CAD, AUD with encrypted checkout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
