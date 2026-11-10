import React, { useState, useMemo } from 'react';
import { Sparkles, Trophy, ArrowRight, Check, Sliders } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RecommendationEngine: React.FC = () => {
  const { products, formatPrice, addToCart, openProductModal } = useApp();

  const [persona, setPersona] = useState<'esports' | 'creator' | 'travel' | 'audiophile'>('esports');
  const [maxBudget, setMaxBudget] = useState<number>(4500);

  // Recommendations based on persona
  const recommendedItems = useMemo(() => {
    if (persona === 'esports') {
      return products.filter((p) =>
        ['wooting-80he-rapid-trigger', 'razer-viper-v3-pro', 'asus-rog-swift-pg32ucdm', 'artisan-hien-fx-mid'].includes(p.id)
      );
    }
    if (persona === 'creator') {
      return products.filter((p) =>
        ['apple-macbook-pro-16-m4-max', 'razer-blade-18-2026', 'asus-rog-swift-pg32ucdm'].includes(p.id)
      );
    }
    if (persona === 'travel') {
      return products.filter((p) =>
        ['asus-rog-zephyrus-g16-oled', 'apple-macbook-pro-16-m4-max', 'razer-viper-v3-pro'].includes(p.id)
      );
    }
    // audiophile
    return products.filter((p) =>
      ['sennheiser-hd-490-pro-plus', 'wooting-80he-rapid-trigger', 'asus-rog-swift-pg32ucdm'].includes(p.id)
    );
  }, [products, persona]);

  const bundleTotalUSD = recommendedItems.reduce((acc, p) => acc + p.price, 0);

  const handleAddBundleToManifest = () => {
    recommendedItems.forEach((item) => {
      addToCart(item.id, 1);
    });
  };

  return (
    <section className="py-12 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#0c1018] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-500 font-semibold tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4" />
              <span>ALGORITHMIC RECOMMENDATION ENGINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Hardware Setup Synthesizer for Power Personas
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-500">
            Calibrated against verified lab telemetry, thermal headroom, and latency metrics
          </p>
        </div>

        {/* Persona Segmented Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              id: 'esports',
              title: 'Esports Tier Competitor',
              desc: '8000Hz polling, 0.1mm Rapid Trigger, 0.03ms pixel response'
            },
            {
              id: 'creator',
              title: 'Creative Pro / 3D Modeler',
              desc: '128GB unified RAM, 175W RTX 4090, 1000 nits Mini-LED'
            },
            {
              id: 'travel',
              title: 'Ultraportable Traveler',
              desc: 'Sub-2.0kg magnesium-aluminum, 240Hz OLED, 8+ hr battery'
            },
            {
              id: 'audiophile',
              title: 'Acoustics & Spatial Purist',
              desc: 'Open acoustic staging, 38mm Neodymium, zero harmonic bleed'
            }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPersona(item.id as any)}
              className={`p-4 rounded-xl border text-left transition-all ${
                persona === item.id
                  ? 'border-amber-500 bg-white dark:bg-[#121724] shadow-md'
                  : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#0e131d] hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold font-mono uppercase text-slate-900 dark:text-white">
                  {item.title}
                </span>
                {persona === item.id && <Check className="w-3.5 h-3.5 text-amber-500" />}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                {item.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Recommended Bundle Grid */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101522] shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-amber-500 block">
                MATCHED SETUP BUNDLE
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {recommendedItems.length} Matched Flagship Components
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-500 block">COMBINED BUNDLE VALUE</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {formatPrice(bundleTotalUSD)}
                </span>
              </div>

              <button
                onClick={handleAddBundleToManifest}
                className="px-4 py-2.5 text-xs font-mono font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
              >
                <span>Add Full Setup to Manifest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedItems.map((prod) => (
              <div
                key={prod.id}
                onClick={() => openProductModal(prod.id)}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 hover:border-amber-500/50 bg-slate-50/60 dark:bg-slate-900/40 transition-colors cursor-pointer flex gap-3 items-center group"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono text-amber-500 font-bold uppercase block truncate">
                    {prod.brand}
                  </span>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-amber-500 transition-colors">
                    {prod.name}
                  </h4>
                  <div className="text-xs font-mono font-bold text-slate-900 dark:text-white tabular-nums pt-0.5">
                    {formatPrice(prod.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
