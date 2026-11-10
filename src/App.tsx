/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/home/Hero';
import { ProductGrid } from './components/catalog/ProductGrid';
import { RecommendationEngine } from './components/home/RecommendationEngine';
import { Footer } from './components/layout/Footer';
import { OfflineBanner } from './components/common/OfflineBanner';
import { ProductDetailModal } from './components/pdp/ProductDetailModal';
import { SpecMatrixModal } from './components/spec-comparison/SpecMatrixModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { BuyingGuidesModal } from './components/guides/BuyingGuidesModal';
import { PriceAlertsModal } from './components/alerts/PriceAlertsModal';
import { WatchlistModal } from './components/watchlist/WatchlistModal';
import { BenchmarkSimulatorModal } from './components/simulator/BenchmarkSimulatorModal';

function MainApp() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17] text-slate-100 transition-colors pb-16 md:pb-0">
      <OfflineBanner />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProductGrid />
        <RecommendationEngine />
      </main>
      <Footer />

      {/* Interactive Modals & Drawers */}
      <ProductDetailModal />
      <SpecMatrixModal />
      <BenchmarkSimulatorModal />
      <CartDrawer />
      <CheckoutModal />
      <AdminDashboardModal />
      <BuyingGuidesModal />
      <PriceAlertsModal />
      <WatchlistModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
