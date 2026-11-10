import React, { useState } from 'react';
import {
  X,
  Scale,
  Bookmark,
  ShoppingBag,
  Bell,
  Share2,
  Check,
  Star,
  Cpu,
  Layers,
  Thermometer,
  Zap,
  TrendingDown,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Review } from '../../types';

export const ProductDetailModal: React.FC = () => {
  const {
    activeModal,
    activeProductId,
    closeModals,
    products,
    formatPrice,
    addToCart,
    toggleCompare,
    isInCompare,
    toggleWatchlist,
    isInWatchlist,
    addPriceAlert,
    setActiveModal,
    openSimulatorModal,
    t
  } = useApp();

  const [activeTab, setActiveTab] = useState<'specs' | 'benchmarks' | 'price_history' | 'reviews'>('specs');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30d' | '90d' | '1y'>('30d');
  const [targetAlertPrice, setTargetAlertPrice] = useState<number>(0);
  const [alertSubmitted, setAlertSubmitted] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // New review state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRig, setReviewRig] = useState('');
  const [reviewsList, setReviewsList] = useState<Review[]>([]);

  if (activeModal !== 'pdp' || !activeProductId) return null;

  const product = products.find((p) => p.id === activeProductId);
  if (!product) return null;

  const inCompare = isInCompare(product.id);
  const inWatchlist = isInWatchlist(product.id);
  const activeReviews = [...reviewsList, ...product.reviews];

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const price = targetAlertPrice > 0 ? targetAlertPrice : Math.round(product.price * 0.9);
    addPriceAlert(product.id, price);
    setAlertSubmitted(true);
    setTimeout(() => setAlertSubmitted(false), 3000);
  };

  const handleShare = () => {
    const text = `Check out ${product.name} on AetherHardware: ${formatPrice(product.price)} - ${product.shortSummary}`;
    navigator.clipboard?.writeText(text);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleShareRedditMarkdown = () => {
    const markdown = `### [AetherHardware Spec Review] ${product.name}
- **Price:** ${formatPrice(product.price)}
- **TGP:** ${product.specs.tgpWatts ? `${product.specs.tgpWatts}W` : 'N/A'}
- **Display:** ${product.specs.display || 'N/A'}
- **CPU/GPU:** ${product.specs.cpu || 'N/A'} / ${product.specs.gpu || 'N/A'}
- **Overall Lab Score:** ${product.benchmarks.overallScore}/100
- **Expert Verdict:** ${product.expertVerdict.verdict}`;
    navigator.clipboard?.writeText(markdown);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      author: 'Alex Vance (You)',
      role: 'Verified Hardware Enthusiast',
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      verifiedBuyer: true,
      testRig: reviewRig || 'Custom Test Bench',
      helpfulCount: 0,
      date: new Date().toISOString().split('T')[0]
    };

    setReviewsList((prev) => [newRev, ...prev]);
    setShowReviewForm(false);
    setReviewTitle('');
    setReviewComment('');
    setReviewRig('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold uppercase text-amber-500">
              {product.brand}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs font-mono text-slate-500 capitalize">
              {product.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-xs flex items-center gap-1.5"
              title="Copy share link"
            >
              {shareCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline font-mono">{shareCopied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={() => toggleCompare(product.id)}
              className={`p-2 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 border ${
                inCompare
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">{inCompare ? 'In Matrix' : 'Compare'}</span>
            </button>

            <button
              onClick={() => toggleWatchlist(product.id)}
              className={`p-2 rounded-lg text-xs transition-colors border ${
                inWatchlist
                  ? 'bg-amber-500 text-slate-950 border-amber-500'
                  : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
              title="Watchlist"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={closeModals}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          
          {/* Top Section: Media + Contiguous Purchase Module */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Gallery (Left Column) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950/40 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[16/10] object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{product.stockCount} units available in {product.warehouse}</span>
                </div>
              </div>
            </div>

            {/* Contiguous Purchase Module (Right Column) */}
            <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  {product.name}
                </h2>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="ml-1 text-slate-900 dark:text-slate-100 font-semibold">{product.rating}</span>
                  </div>
                  <span aria-hidden="true">·</span>
                  <span>{activeReviews.length} community reviews</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-500 font-semibold">Overall Lab Score {product.benchmarks.overallScore}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Purchase Box */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300 block">BASE MANIFEST PRICE</span>
                    <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  {product.originalPrice && (
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-300 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      addToCart(product.id);
                      closeModals();
                    }}
                    className="w-full py-3 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center justify-center gap-2 font-mono shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Hardware Manifest</span>
                  </button>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-300 pt-1">
                    <span>Dispatch: Within 24 Hours</span>
                    <span>Free Global Expedited Shipping</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Deep Tabs: Specs, Benchmarks, Price Tracking, Reviews */}
          <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            
            {/* Tab navigation buttons */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-4 py-2 text-xs font-mono font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'specs'
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Hardware Specifications
              </button>

              <button
                onClick={() => setActiveTab('benchmarks')}
                className={`px-4 py-2 text-xs font-mono font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'benchmarks'
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Lab Benchmarks & Thermals
              </button>

              <button
                onClick={() => setActiveTab('price_history')}
                className={`px-4 py-2 text-xs font-mono font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'price_history'
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Price Radar & Alerts
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2 text-xs font-mono font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'reviews'
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Verified Test Reports ({activeReviews.length})
              </button>
            </div>

            {/* TAB 1: Specs Sheet */}
            {activeTab === 'specs' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {Object.entries(product.specs).map(([key, val]) => {
                    if (!val) return null;
                    const label = key.replace(/([A-Z])/g, ' $1').toUpperCase();
                    const valueStr = Array.isArray(val) ? val.join(', ') : String(val);
                    return (
                      <div
                        key={key}
                        className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex justify-between gap-4"
                      >
                        <span className="text-slate-600 dark:text-slate-300 font-semibold">{label}</span>
                        <span className="text-slate-900 dark:text-slate-100 text-right font-medium">
                          {valueStr}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Expert Verdict Block */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-500 font-bold uppercase">
                    <Check className="w-4 h-4" />
                    <span>{t('expert_verdict')}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {product.expertVerdict.verdict}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                    <div>
                      <span className="font-mono text-emerald-500 font-semibold block mb-1">PROS</span>
                      <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400 font-sans">
                        {product.expertVerdict.pros.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-mono text-rose-500 font-semibold block mb-1">CONS / TRADE-OFFS</span>
                      <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400 font-sans">
                        {product.expertVerdict.cons.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                    <span className="font-mono text-slate-600 dark:text-slate-300">RECOMMENDED FOR: </span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium font-sans">
                      {product.expertVerdict.bestFor}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Benchmarks */}
            {activeTab === 'benchmarks' && (
              <div className="space-y-6">
                
                {/* Simulation Launcher Banner */}
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                  <div>
                    <span className="text-amber-500 font-bold uppercase block flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      <span>SIMULATE AGAINST INDUSTRY BENCHMARK STANDARDS</span>
                    </span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-sans mt-0.5">
                      Compare {product.name} against desktop references, average 115W laptops, and Apple Silicon in the Silicon Simulation Lab.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      closeModals();
                      openSimulatorModal(product.id);
                    }}
                    className="px-4 py-2 font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shadow-sm shrink-0"
                  >
                    Launch Simulation Tool
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  {product.benchmarks.geekbenchMulti && (
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-1">
                      <span className="text-slate-600 dark:text-slate-300 text-[11px]">GEEKBENCH 6 MULTI</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums block">
                        {product.benchmarks.geekbenchMulti.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {product.benchmarks.cinebench2024 && (
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-1">
                      <span className="text-slate-600 dark:text-slate-300 text-[11px]">CINEBENCH 2024</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums block">
                        {product.benchmarks.cinebench2024.toLocaleString()} pts
                      </span>
                    </div>
                  )}

                  {product.benchmarks.timeSpyGraphics && (
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-1">
                      <span className="text-slate-600 dark:text-slate-300 text-[11px]">3DMARK TIMESPY</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums block">
                        {product.benchmarks.timeSpyGraphics.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {product.benchmarks.latencyClickMs && (
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-1">
                      <span className="text-slate-600 dark:text-slate-300 text-[11px]">CLICK RESPONSE</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums block">
                        {product.benchmarks.latencyClickMs} ms
                      </span>
                    </div>
                  )}

                  {product.benchmarks.noiseDbaLoad !== undefined && (
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-1">
                      <span className="text-slate-600 dark:text-slate-300 text-[11px]">ACOUSTIC NOISE (LOAD)</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums block">
                        {product.benchmarks.noiseDbaLoad} dBA
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900/40 text-xs font-mono space-y-2">
                  <span className="text-amber-500 font-bold block">LABORATORY METHODOLOGY NOTE</span>
                  <p className="text-slate-400 font-sans leading-relaxed">
                    All thermal stress loops were conducted in an ambient 21.0°C ISO-calibrated test chamber. Laptops were elevated on a flat wooden surface without external cooling pads. Polling latency was verified with a 10,000-frame optical laser sensor test bench.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: Price Tracking & Alerts */}
            {activeTab === 'price_history' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono text-slate-500">
                    HISTORICAL SETTLEMENT PRICES ({selectedTimeframe})
                  </div>
                  <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg text-xs font-mono">
                    {(['30d', '90d', '1y'] as const).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setSelectedTimeframe(tf)}
                        className={`px-2.5 py-1 rounded transition-colors ${
                          selectedTimeframe === tf
                            ? 'bg-white dark:bg-slate-800 text-amber-500 font-semibold'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {tf.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price History Visualization */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-4">
                  <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2">
                    {product.priceHistory.map((pt, idx) => {
                      const maxPrice = Math.max(...product.priceHistory.map((p) => p.price));
                      const minPrice = Math.min(...product.priceHistory.map((p) => p.price));
                      const heightPercent = maxPrice === minPrice ? 70 : 30 + ((pt.price - minPrice) / (maxPrice - minPrice)) * 60;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                          <span className="text-[10px] font-mono tabular-nums text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            {formatPrice(pt.price)}
                          </span>
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className="w-full max-w-[36px] bg-amber-500/80 hover:bg-amber-400 rounded-t transition-all cursor-pointer"
                          />
                          <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                            {pt.date}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Set Price Drop Alert Trigger */}
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-500">
                    <Bell className="w-4 h-4" />
                    <span>SET INSTANT PRICE RADAR DROP ALERT</span>
                  </div>
                  <form onSubmit={handleSetAlert} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="number"
                      placeholder={`Target Price (e.g. ${Math.round(product.price * 0.9)})`}
                      onChange={(e) => setTargetAlertPrice(Number(e.target.value))}
                      className="flex-1 px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-mono font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap"
                    >
                      {alertSubmitted ? 'Alert Armed!' : 'Arm Radar Alert'}
                    </button>
                  </form>
                  {alertSubmitted && (
                    <p className="text-xs text-emerald-500 font-mono">
                      Push alert successfully activated! You will receive notification as soon as price drops below target.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: Community Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono text-slate-500">
                    VERIFIED COMMUNITY BENCHMARK REVIEWS
                  </div>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-3 py-1.5 text-xs font-mono font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{showReviewForm ? 'Cancel Report' : 'Submit Test Report'}</span>
                  </button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleAddReview} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-500">RATING:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setReviewRating(s)}
                            className="p-1 text-amber-400"
                          >
                            <Star className={`w-4 h-4 ${s <= reviewRating ? 'fill-current' : 'opacity-30'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="Report Headline (e.g. Thermals held under sustained 8K compile)"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />

                    <input
                      type="text"
                      placeholder="Your Hardware Test Rig (e.g. 10GbE LAN + DP 2.1 OLED)"
                      value={reviewRig}
                      onChange={(e) => setReviewRig(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />

                    <textarea
                      placeholder="Detailed findings on thermals, acoustics, frame pacing, or ergonomics..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      rows={3}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />

                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-mono font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors"
                    >
                      Publish Verified Report
                    </button>
                  </form>
                )}

                {/* Review Cards */}
                <div className="space-y-3">
                  {activeReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white font-mono">{rev.author}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">{rev.role}</span>
                          {rev.verifiedBuyer && (
                            <span className="text-[10px] text-emerald-500 font-mono">Verified Buyer</span>
                          )}
                        </div>
                        <span className="text-slate-400 font-mono text-[11px]">{rev.date}</span>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>

                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                        {rev.title}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {rev.comment}
                      </p>

                      <div className="pt-1 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                        <span>{rev.testRig}</span>
                        <span>{rev.helpfulCount} engineers found this helpful</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Share Formats & Reddit Table Export */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <span className="text-slate-500">SHARE WITH ENTHUSIAST COMMUNITIES:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareRedditMarkdown}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors flex items-center gap-1"
                >
                  <span>Export Reddit r/hardware Table</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors"
                >
                  Copy Direct Link
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
