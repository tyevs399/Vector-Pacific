import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Scale, X, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCategory } from '../../types';
import { ProductCard } from './ProductCard';

export const ProductGrid: React.FC = () => {
  const { products, compareList, clearCompare, setActiveModal, t } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'benchmark' | 'rating'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [highRefreshFilter, setHighRefreshFilter] = useState(false);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

        // In Stock
        if (onlyInStock && p.stockCount <= 0) return false;

        // High refresh or rapid sampling
        if (highRefreshFilter) {
          const isHighRefresh = (p.specs.refreshRateHz && p.specs.refreshRateHz >= 240);
          const isHighPolling = (p.specs.pollingRateHz && p.specs.pollingRateHz >= 8000);
          if (!isHighRefresh && !isHighPolling) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesBrand = p.brand.toLowerCase().includes(q);
          const matchesCpu = p.specs.cpu?.toLowerCase().includes(q);
          const matchesGpu = p.specs.gpu?.toLowerCase().includes(q);
          const matchesSwitch = p.specs.switchType?.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          if (!matchesName && !matchesBrand && !matchesCpu && !matchesGpu && !matchesSwitch && !matchesDesc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'benchmark') return b.benchmarks.overallScore - a.benchmarks.overallScore;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured maintains editorial order
      });
  }, [products, selectedCategory, searchQuery, sortBy, onlyInStock, highRefreshFilter]);

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: t('filter_all') },
    { id: 'laptops', label: t('filter_laptops') },
    { id: 'keyboards', label: t('filter_keyboards') },
    { id: 'mice', label: t('filter_mice') },
    { id: 'monitors', label: t('filter_monitors') },
    { id: 'audio', label: t('filter_audio') },
    { id: 'accessories', label: t('filter_accessories') }
  ];

  return (
    <section id="catalog" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header: Quiet Editorial Lead */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="text-xs font-mono text-amber-500 font-semibold tracking-wider uppercase mb-1">
            HARDWARE MANIFEST
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Curated Enthusiast Hardware Inventory
          </h2>
        </div>
        <p className="text-xs font-mono text-slate-600 dark:text-slate-300">
          Showing {filteredProducts.length} verified units · All items with certified lab benchmarks
        </p>
      </div>

      {/* Interactive Filter & Search Bar */}
      <div className="py-6 space-y-4">
        
        {/* Row 1: Search & Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#101520] border border-slate-200 dark:border-slate-800 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 font-mono transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 bg-white dark:bg-[#101520] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="featured">{t('sort_featured')}</option>
              <option value="benchmark">{t('sort_benchmark')}</option>
              <option value="rating">{t('sort_rating')}</option>
              <option value="price_asc">{t('sort_price_asc')}</option>
              <option value="price_desc">{t('sort_price_desc')}</option>
            </select>
          </div>
        </div>

        {/* Row 2: Segmented Category Tabs & Quick Spec Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Category Tabs (Segmented control button pattern) */}
          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 dark:bg-[#101520] rounded-lg border border-slate-200/80 dark:border-slate-800/80">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Hardware Toggles */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                onlyInStock
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${onlyInStock ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span>In Stock Only</span>
            </button>

            <button
              onClick={() => setHighRefreshFilter(!highRefreshFilter)}
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                highRefreshFilter
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 font-medium'
                  : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <span>240Hz+ / 8000Hz Tier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid: 3-column desktop layout (§2.A) */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-3">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            No hardware configurations match the active filter criteria.
          </p>
          <p className="text-xs text-slate-500">
            Try adjusting search terms or toggling off the extreme refresh rate filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setOnlyInStock(false);
              setHighRefreshFilter(false);
            }}
            className="px-4 py-2 text-xs font-mono font-medium text-amber-500 border border-amber-500/30 rounded-lg hover:bg-amber-500/10 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Floating Compare Tray (Shows when 1+ products selected for comparison) */}
      {compareList.length > 0 && (
        <aside 
          aria-label="Active Hardware Comparison Tray"
          className="fixed bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl bg-white dark:bg-[#121722] border border-amber-500/40 rounded-xl shadow-2xl p-3 flex items-center justify-between gap-4 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                Spec Comparison Tray ({compareList.length}/4)
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300">
                Ready to render cross-hardware benchmark differential
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearCompare}
              className="px-3 py-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setActiveModal('compare')}
              className="px-4 py-2 text-xs font-semibold font-mono text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <span>{t('view_compare_matrix')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

    </section>
  );
};
