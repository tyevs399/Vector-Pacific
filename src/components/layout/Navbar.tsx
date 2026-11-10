import React, { useState } from 'react';
import {
  ShoppingBag,
  Scale,
  Bell,
  Sun,
  Moon,
  Globe,
  WifiOff,
  Wifi,
  ShieldCheck,
  User,
  SlidersHorizontal,
  Bookmark,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CURRENCIES, LANGUAGES } from '../../data/products';
import { CurrencyCode, LanguageCode } from '../../types';

export const Navbar: React.FC = () => {
  const {
    t,
    cartCount,
    compareList,
    watchlist,
    unreadNotificationCount,
    notifications,
    currency,
    setCurrencyCode,
    language,
    setLanguageCode,
    isDarkMode,
    toggleDarkMode,
    isOffline,
    toggleSimulatedOffline,
    isEncrypted,
    setActiveModal,
    openProductModal,
    openSimulatorModal,
    currentUser,
    loginAsDemoUser
  } = useApp();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  return (
    <>
      {/* Top Bar strictly abiding by Section 2 Top Bar Contract */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0b0f17]/95 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          
          {/* Zone 1: Brand Wordmark (Single text element in display face) */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 flex items-center gap-2 group"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block transform rotate-45 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-extrabold tracking-wider font-mono">AETHER</span>
            <span className="font-light text-slate-500 dark:text-slate-400">HARDWARE</span>
          </a>

          {/* Zone 2: 4–5 clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a
              href="#catalog"
              className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              {t('nav_catalog')}
            </a>
            <button
              onClick={() => setActiveModal('compare')}
              className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>{t('nav_spec_matrix')}</span>
              {compareList.length > 0 && (
                <span className="text-[11px] font-mono px-1.5 py-0.2 bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded">
                  {compareList.length}
                </span>
              )}
            </button>
            <button
              onClick={() => openSimulatorModal()}
              className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-amber-500 font-semibold"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Benchmark Lab</span>
            </button>
            <button
              onClick={() => setActiveModal('guides')}
              className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              {t('nav_guides')}
            </button>
            <button
              onClick={() => setActiveModal('admin')}
              className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('nav_admin')}</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & Essential Utilities */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Offline simulator status toggle */}
            <button
              onClick={toggleSimulatedOffline}
              title={isOffline ? t('simulate_online') : t('simulate_offline')}
              className={`p-2 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 border ${
                isOffline
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {isOffline ? <WifiOff className="w-4 h-4 text-amber-500" /> : <Wifi className="w-4 h-4 text-emerald-500" />}
              <span className="hidden xl:inline text-[11px]">{isOffline ? 'Offline Cache' : 'Cloud Link'}</span>
            </button>

            {/* Language & Currency selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs font-mono flex items-center gap-1.5 transition-colors"
                title="Currency & Language"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{currency.code}</span>
              </button>

              {showLangMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121722] shadow-xl p-3 z-50 text-xs space-y-3"
                  onMouseLeave={() => setShowLangMenu(false)}
                >
                  <div>
                    <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300 block mb-1.5">
                      CURRENCY
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {CURRENCIES.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => {
                            setCurrencyCode(c.code as CurrencyCode);
                            setShowLangMenu(false);
                          }}
                          className={`px-2 py-1.5 rounded text-left font-mono text-xs flex items-center justify-between ${
                            currency.code === c.code
                              ? 'bg-amber-500/10 text-amber-500 font-semibold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>{c.code}</span>
                          <span className="text-[10px] text-slate-600 dark:text-slate-300">{c.symbol}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
                    <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300 block mb-1.5">
                      LANGUAGE
                    </span>
                    <div className="grid grid-cols-2 gap-1">
                      {LANGUAGES.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            setLanguageCode(l.code as LanguageCode);
                            setShowLangMenu(false);
                          }}
                          className={`px-2 py-1 rounded text-left text-xs flex items-center gap-1.5 ${
                            language === l.code
                              ? 'bg-amber-500/10 text-amber-500 font-semibold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>{l.flag}</span>
                          <span>{l.nativeName}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 transition-colors"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Notifications Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 transition-colors relative"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 font-mono text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div
                  className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121722] shadow-2xl p-4 z-50 text-xs"
                  onMouseLeave={() => setShowNotifMenu(false)}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-900 dark:text-white font-mono text-xs">
                      Live Push Stream
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-300">
                      {notifications.length} events
                    </span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 space-y-1 hover:border-amber-500/40 transition-colors cursor-pointer"
                        onClick={() => {
                          if (n.productId) openProductModal(n.productId);
                          setShowNotifMenu(false);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 dark:text-white text-[11px]">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                          {n.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Watchlist trigger */}
            <button
              onClick={() => setActiveModal('watchlist')}
              className="hidden sm:flex p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 transition-colors relative"
              title="Watchlist"
            >
              <Bookmark className="w-4 h-4" />
              {watchlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-slate-800 dark:bg-slate-700 text-white font-mono text-[9px] rounded-full flex items-center justify-center">
                  {watchlist.length}
                </span>
              )}
            </button>

            {/* Primary Action Button: Cart Drawer */}
            <button
              onClick={() => setActiveModal('cart')}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 shadow-sm font-mono"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Manifest</span>
              <span className="bg-slate-950 text-amber-400 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Mobile-First Touch standard) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0b0f17]/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-lg px-2 py-2 flex items-center justify-around text-[10px] font-medium text-slate-600 dark:text-slate-400">
        <a
          href="#catalog"
          className="flex flex-col items-center gap-1 p-1 hover:text-amber-500"
        >
          <span className="w-4 h-4 rounded-sm border border-current flex items-center justify-center font-mono text-[9px]">C</span>
          <span>Catalog</span>
        </a>
        <button
          onClick={() => setActiveModal('compare')}
          className="flex flex-col items-center gap-1 p-1 hover:text-amber-500 relative"
        >
          <Scale className="w-4 h-4" />
          <span>Matrix</span>
          {compareList.length > 0 && (
            <span className="absolute top-0 right-1 w-3.5 h-3.5 bg-amber-500 text-slate-950 font-bold rounded-full text-[8px] flex items-center justify-center">
              {compareList.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveModal('watchlist')}
          className="flex flex-col items-center gap-1 p-1 hover:text-amber-500"
        >
          <Bookmark className="w-4 h-4" />
          <span>Watchlist</span>
        </button>
        <button
          onClick={() => setActiveModal('cart')}
          className="flex flex-col items-center gap-1 p-1 text-amber-500 relative"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Manifest</span>
          {cartCount > 0 && (
            <span className="absolute top-0 right-2 w-3.5 h-3.5 bg-slate-950 text-amber-400 font-bold rounded-full text-[8px] flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveModal('admin')}
          className="flex flex-col items-center gap-1 p-1 hover:text-amber-500"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Admin</span>
        </button>
      </nav>
    </>
  );
};
