import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    activeModal,
    closeModals,
    cart,
    products,
    formatPrice,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotalUSD,
    currency,
    setActiveModal,
    t
  } = useApp();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');

  if (activeModal !== 'cart') return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'OVERCLOCK10') {
      setDiscountPercent(10);
      setPromoError('');
    } else if (promoCode.trim().toUpperCase() === 'TITAN20') {
      setDiscountPercent(20);
      setPromoError('');
    } else {
      setPromoError('Invalid hardware discount code.');
    }
  };

  const discountedTotalUSD = cartTotalUSD * (1 - discountPercent / 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-y-0 right-0 max-w-full flex pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-white dark:bg-[#101522] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                {t('cart_title')}
              </h2>
            </div>
            <button
              onClick={closeModals}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto opacity-50" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t('empty_cart')}
                </p>
                <p className="text-xs text-slate-500">
                  Select high-performance laptops or esports peripherals from the catalog.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;

                  return (
                    <div
                      key={item.productId}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex gap-3 items-center"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] font-mono text-amber-500 font-semibold uppercase block truncate">
                          {product.brand}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {product.name}
                        </h4>
                        <div className="text-xs font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                          {formatPrice(product.price * item.quantity)}
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 rounded-lg p-1 bg-white dark:bg-slate-800/80">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                          title="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold w-5 text-center text-slate-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                          title="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
              
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Code: OVERCLOCK10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs font-mono uppercase bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-mono font-medium text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Apply
                </button>
              </form>
              {promoError && <p className="text-[11px] text-rose-500 font-mono">{promoError}</p>}
              {discountPercent > 0 && (
                <p className="text-[11px] text-emerald-500 font-mono">
                  Hardware discount applied: -{discountPercent}% OFF!
                </p>
              )}

              {/* Price Calculation Breakdown */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-500">
                  <span>Manifest Subtotal</span>
                  <span className="tabular-nums text-slate-900 dark:text-slate-200 font-medium">
                    {formatPrice(cartTotalUSD)}
                  </span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-500">
                    <span>Discount ({discountPercent}%)</span>
                    <span className="tabular-nums">
                      -{formatPrice(cartTotalUSD * (discountPercent / 100))}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Global Secure Shipping</span>
                  <span className="text-emerald-500 font-semibold">FREE (Priority Air)</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total Due ({currency.code})</span>
                  <span className="tabular-nums text-amber-500">
                    {formatPrice(discountedTotalUSD)}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                onClick={() => setActiveModal('checkout')}
                className="w-full py-3 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center justify-center gap-2 font-mono shadow-sm"
              >
                <span>{t('checkout_now')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-bit TLS Encrypted Multi-Currency Processing</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
