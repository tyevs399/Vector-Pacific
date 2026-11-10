import React, { useState } from 'react';
import {
  X,
  CreditCard,
  CheckCircle2,
  Printer,
  ShieldCheck,
  QrCode,
  DollarSign,
  ArrowRight,
  WifiOff,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    activeModal,
    closeModals,
    cart,
    products,
    cartTotalUSD,
    currency,
    formatPrice,
    placeOrder,
    isOffline,
    currentUser
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('Credit Card');
  const [name, setName] = useState(currentUser.name || 'Alex Vance');
  const [address, setAddress] = useState('428 Silicon Boulevard, Suite 500');
  const [city, setCity] = useState('San Jose');
  const [country, setCountry] = useState('United States');
  const [postalCode, setPostalCode] = useState('95113');

  // Credit Card fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('884');

  // Processing & Confirmation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (activeModal !== 'checkout') return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate 1.2s payment gateway authorization
    setTimeout(async () => {
      const order = await placeOrder(
        { name, address, city, country, postalCode },
        paymentMethod
      );

      setIsProcessing(false);
      setCompletedOrder(order);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.warn('Confetti effect suppressed:', err);
      }
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-mono">
              {completedOrder ? 'Order Confirmation & Manifest Receipt' : 'Multi-Currency Secure Checkout'}
            </h2>
          </div>
          <button
            onClick={closeModals}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {completedOrder ? (
            /* Order Success Receipt View */
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                    {completedOrder.status === 'Queued Offline'
                      ? 'Order Successfully Queued Locally (Offline Mode)'
                      : 'Payment Settled & Hardware Order Manifest Generated'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {completedOrder.status === 'Queued Offline'
                      ? 'Your order is cryptographically encrypted in device storage and will dispatch automatically once network connectivity is reestablished.'
                      : `A confirmation receipt and courier tracking label have been dispatched to ${currentUser.email}.`}
                  </p>
                </div>
              </div>

              {/* Printable Invoice Manifest Card */}
              <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4 font-mono text-xs">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">INVOICE ID</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{completedOrder.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">TRACKING NUMBER</span>
                    <span className="font-bold text-amber-500">{completedOrder.trackingNumber}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 block text-[10px]">DESTINATION</span>
                    <p className="text-slate-700 dark:text-slate-300 font-sans text-xs">
                      {completedOrder.shippingAddress.name}<br />
                      {completedOrder.shippingAddress.address}<br />
                      {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.postalCode}<br />
                      {completedOrder.shippingAddress.country}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">PAYMENT METHOD</span>
                    <p className="text-slate-700 dark:text-slate-300 font-sans text-xs">
                      {completedOrder.paymentMethod}<br />
                      Settlement: {currency.code} ({currency.symbol})
                      {completedOrder.cryptoTxHash && (
                        <span className="block text-[10px] text-amber-500 font-mono truncate">
                          TX: {completedOrder.cryptoTxHash}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-slate-400 block text-[10px]">MANIFEST LINE ITEMS</span>
                  {completedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1">
                      <span className="text-slate-800 dark:text-slate-200">{it.name} x{it.quantity}</span>
                      <span className="font-bold tabular-nums">{formatPrice(it.priceUSD * it.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white">
                    <span>Total Paid</span>
                    <span className="text-amber-500 tabular-nums">{formatPrice(completedOrder.totalUSD)}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Formal Invoice</span>
                </button>

                <button
                  onClick={closeModals}
                  className="px-5 py-2.5 text-xs font-mono font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors shadow-sm"
                >
                  Return to Hardware Catalog
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {isOffline && (
                <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center gap-2 text-xs font-mono text-amber-500">
                  <WifiOff className="w-4 h-4 shrink-0" />
                  <span>Offline Mode Active: Order will be securely queued in local encrypted storage.</span>
                </div>
              )}

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-semibold text-slate-500 block">
                  PAYMENT GATEWAY METHOD ({currency.code})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Credit Card', 'Apple Pay', 'PayPal', 'Crypto (Lightning)'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 rounded-xl border text-xs font-mono font-medium transition-all text-left flex flex-col justify-between h-20 ${
                        paymentMethod === method
                          ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400">SELECT</span>
                      <span>{method}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Payment UI based on method */}
              {paymentMethod === 'Credit Card' && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3 font-mono text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">CARD NUMBER</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">EXPIRY</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">CVC / CVV</label>
                      <input
                        type="text"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'Crypto (Lightning)' && (
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-amber-500 font-bold">
                    <QrCode className="w-4 h-4" />
                    <span>BITCOIN LIGHTNING & USDC INSTANT SETTLEMENT</span>
                  </div>
                  <p className="text-slate-400 font-sans">
                    Scan invoice QR or send to dynamic contract: <code className="bg-slate-900 px-1 py-0.5 rounded text-[10px] text-amber-400">lnbc100u1pn9q...</code>. Zero network gas surcharges.
                  </p>
                </div>
              )}

              {/* Shipping Address */}
              <div className="space-y-3 font-mono text-xs">
                <label className="font-semibold text-slate-500 block">
                  DELIVERY ADDRESS
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Recipient Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Street Address & Suite"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Order Manifest Summary & Final Pay Button */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Order Manifest Items:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{cart.length} SKUs</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold font-mono">
                  <span className="text-slate-900 dark:text-white">Total Amount ({currency.code}):</span>
                  <span className="text-amber-500 tabular-nums">{formatPrice(cartTotalUSD)}</span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || cart.length === 0}
                  className="w-full py-3 text-xs font-semibold font-mono text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {isProcessing ? (
                    <span>Authorizing Hardware Transaction...</span>
                  ) : (
                    <>
                      <span>Authorize & Pay {formatPrice(cartTotalUSD)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verified 3D-Secure 2.0 & PCI-DSS Tier 1 Certified</span>
                </div>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
