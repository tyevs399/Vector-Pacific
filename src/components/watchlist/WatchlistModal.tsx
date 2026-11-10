import React, { useState } from 'react';
import { X, Bookmark, ShoppingBag, Eye, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WatchlistItem } from '../../types';

export const WatchlistModal: React.FC = () => {
  const {
    activeModal,
    closeModals,
    watchlist,
    toggleWatchlist,
    products,
    formatPrice,
    addToCart,
    openProductModal
  } = useApp();

  const [activeTag, setActiveTag] = useState<WatchlistItem['tag'] | 'all'>('all');

  if (activeModal !== 'watchlist') return null;

  const filteredWatchlist = watchlist.filter((w) => activeTag === 'all' || w.tag === activeTag);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                Personalized Hardware Watchlist
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Curated configurations saved for priority acquisition
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

        {/* Tag Filters */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 text-xs font-mono overflow-x-auto">
          {(['all', 'Dream Rig', 'Desk Upgrade', 'Workstation', 'Under Observation'] as const).map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`pb-3 px-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTag === tag
                  ? 'border-amber-500 text-amber-500 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tag === 'all' ? 'All Watchlist' : tag}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          {filteredWatchlist.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Bookmark className="w-12 h-12 text-slate-600 mx-auto opacity-50" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No hardware units saved under this watchlist filter.
              </p>
              <p className="text-xs text-slate-500">
                Click the bookmark icon on any product in the catalog to save it to your personalized rigs list.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredWatchlist.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;

                return (
                  <div
                    key={item.productId}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                          <span className="text-amber-500 uppercase font-bold">{product.brand}</span>
                          <span>·</span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {item.tag}
                          </span>
                        </div>
                        <h4 
                          onClick={() => openProductModal(product.id)}
                          className="text-xs font-bold text-slate-900 dark:text-white hover:text-amber-500 cursor-pointer"
                        >
                          {product.name}
                        </h4>
                        <div className="text-xs font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                          {formatPrice(product.price)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => openProductModal(product.id)}
                        className="px-3 py-1.5 text-xs font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Specs</span>
                      </button>

                      <button
                        onClick={() => addToCart(product.id)}
                        className="px-3.5 py-1.5 text-xs font-mono font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Manifest</span>
                      </button>

                      <button
                        onClick={() => toggleWatchlist(product.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                        title="Remove"
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

      </div>
    </div>
  );
};
