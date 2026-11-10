import React, { useState } from 'react';
import { Scale, Bookmark, ShoppingBag, Eye, Zap, Flame, Activity } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    formatPrice,
    addToCart,
    openProductModal,
    openSimulatorModal,
    toggleCompare,
    isInCompare,
    toggleWatchlist,
    isInWatchlist,
    t
  } = useApp();

  const [imageError, setImageError] = useState(false);
  const inCompare = isInCompare(product.id);
  const inWatchlist = isInWatchlist(product.id);

  return (
    <div className="group relative flex flex-col rounded-xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#101520] hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-200 overflow-hidden">
      
      {/* Top Media Showcase Container (65-75% proportion) */}
      <div 
        className="relative aspect-[4/3] bg-slate-100 dark:bg-[#0c1017] overflow-hidden cursor-pointer"
        onClick={() => openProductModal(product.id)}
      >
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500 p-4 text-center">
            <Zap className="w-8 h-8 text-amber-500 mb-2" />
            <span className="text-xs font-mono font-medium">{product.name}</span>
          </div>
        )}

        {/* Quiet Kicker Overlay (Zero-Pill: pure unboxed text) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-900 dark:text-white bg-white/90 dark:bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded">
          {product.badge && <span className="text-amber-500">{product.badge}</span>}
          {product.badge && <span className="text-slate-400">·</span>}
          <span>{product.releaseYear}</span>
        </div>

        {/* Quick Action Overlay Buttons (Appears on Hover / Always accessible on touch) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(product.id);
            }}
            title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            className={`p-1.5 rounded-md backdrop-blur-md transition-colors ${
              inWatchlist
                ? 'bg-amber-500 text-slate-950'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-amber-500'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(product.id);
            }}
            title={inCompare ? 'Remove from Matrix' : 'Add to Spec Comparison'}
            className={`p-1.5 rounded-md backdrop-blur-md transition-colors ${
              inCompare
                ? 'bg-amber-500 text-slate-950'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-amber-500'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Warehouse Stock Ribbon at base of media */}
        <div className="absolute bottom-0 inset-x-0 bg-slate-950/85 backdrop-blur-sm px-3 py-1 flex items-center justify-between text-[11px] font-mono text-slate-300">
          <span className="text-slate-400 truncate max-w-[150px]">{product.warehouse}</span>
          <span className={`tabular-nums ${product.stockCount <= 3 ? 'text-amber-400 font-semibold' : 'text-emerald-400'}`}>
            {product.stockCount} units left
          </span>
        </div>
      </div>

      {/* Card Content & Spec Breakdown */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        {/* Brand & Category Unboxed Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span className="uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
              {product.brand}
            </span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{product.category}</span>
          </div>

          <h3 
            onClick={() => openProductModal(product.id)}
            className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {product.shortSummary}
          </p>
        </div>

        {/* Micro Spec Bullet Grid */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-slate-600 dark:text-slate-300 space-y-1">
          {product.specs.tgpWatts && (
            <div className="flex justify-between">
              <span>Max TGP:</span>
              <span className="text-slate-900 dark:text-slate-200 font-medium tabular-nums">{product.specs.tgpWatts}W</span>
            </div>
          )}
          {product.specs.refreshRateHz && (
            <div className="flex justify-between">
              <span>Refresh:</span>
              <span className="text-slate-900 dark:text-slate-200 font-medium tabular-nums">{product.specs.refreshRateHz}Hz {product.specs.displayType || ''}</span>
            </div>
          )}
          {product.specs.pollingRateHz && (
            <div className="flex justify-between">
              <span>Polling:</span>
              <span className="text-slate-900 dark:text-slate-200 font-medium tabular-nums">{product.specs.pollingRateHz}Hz Native</span>
            </div>
          )}
          {product.specs.weightKg && (
            <div className="flex justify-between">
              <span>Weight:</span>
              <span className="text-slate-900 dark:text-slate-200 font-medium tabular-nums">{product.specs.weightKg} kg</span>
            </div>
          )}
        </div>

        {/* Baseline: Tabular Price & Quick Purchase CTA */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs font-mono text-slate-600 dark:text-slate-300 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => openSimulatorModal(product.id)}
              className="p-2 text-xs font-medium text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors border border-amber-500/30"
              title="Simulate Industry Benchmarks (Cinebench, Geekbench)"
            >
              <Activity className="w-4 h-4" />
            </button>

            <button
              onClick={() => openProductModal(product.id)}
              className="p-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
              title="Inspect Specs"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => addToCart(product.id)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-1.5 font-mono shadow-sm whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t('add_to_cart')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
