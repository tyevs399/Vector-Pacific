import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Product,
  CartItem,
  WatchlistItem,
  PriceAlert,
  CurrencyCode,
  CurrencyConfig,
  LanguageCode,
  UserAccount,
  Order,
  AppNotification
} from '../types';
import { INITIAL_PRODUCTS, CURRENCIES, LANGUAGES } from '../data/products';
import { TRANSLATIONS } from '../data/translations';
import { StorageService, encryptData } from '../services/storage';

interface AppContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotalUSD: number;

  watchlist: WatchlistItem[];
  toggleWatchlist: (productId: string, tag?: WatchlistItem['tag']) => void;
  isInWatchlist: (productId: string) => boolean;

  compareList: string[];
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;

  priceAlerts: PriceAlert[];
  addPriceAlert: (productId: string, targetPrice: number, email?: string) => void;
  removePriceAlert: (id: string) => void;
  triggerSimulatedPriceDrop: () => void;

  currency: CurrencyConfig;
  setCurrencyCode: (code: CurrencyCode) => void;
  formatPrice: (amountUSD: number) => string;

  language: LanguageCode;
  setLanguageCode: (code: LanguageCode) => void;
  t: (key: string) => string;

  isDarkMode: boolean;
  toggleDarkMode: () => void;

  isOffline: boolean;
  toggleSimulatedOffline: () => void;

  isEncrypted: boolean;
  toggleEncryption: () => Promise<void>;

  deviceSynced: boolean;
  lastSyncTime: string;
  triggerCloudSync: () => void;

  currentUser: UserAccount;
  loginAsDemoUser: (role?: 'enthusiast' | 'admin') => void;
  logoutUser: () => void;

  orders: Order[];
  placeOrder: (shippingAddress: Order['shippingAddress'], paymentMethod: Order['paymentMethod']) => Promise<Order>;

  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addNotification: (title: string, message: string, type: AppNotification['type'], productId?: string) => void;

  activeModal: 'cart' | 'checkout' | 'compare' | 'alerts' | 'watchlist' | 'admin' | 'guides' | 'pdp' | 'auth' | 'simulator' | null;
  setActiveModal: (modal: AppContextType['activeModal']) => void;
  activeProductId: string | null;
  openProductModal: (productId: string) => void;
  simulatorProductId: string | null;
  openSimulatorModal: (productId?: string) => void;
  closeModals: () => void;

  updateProductStock: (productId: string, newStock: number) => void;
  updateProductPrice: (productId: string, newPrice: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products state (persisted or initial)
  const [products, setProducts] = useState<Product[]>(() => {
    return StorageService.get<Product[]>('aether_catalog_v1', INITIAL_PRODUCTS);
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    return StorageService.get<CartItem[]>(StorageService.KEYS.CART, [
      { productId: 'wooting-80he-rapid-trigger', quantity: 1, addedAt: Date.now() - 3600000 }
    ]);
  });

  // Watchlist state
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    return StorageService.get<WatchlistItem[]>(StorageService.KEYS.WATCHLIST, [
      { productId: 'razer-blade-18-2026', tag: 'Dream Rig', addedAt: '2026-11-04' },
      { productId: 'asus-rog-swift-pg32ucdm', tag: 'Desk Upgrade', addedAt: '2026-11-05' }
    ]);
  });

  // Compare List state (max 4 products)
  const [compareList, setCompareList] = useState<string[]>([]);

  // Price Alerts
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    return StorageService.get<PriceAlert[]>(StorageService.KEYS.ALERTS, [
      {
        id: 'alert-1',
        productId: 'razer-blade-18-2026',
        productName: 'Razer Blade 18 (2026 Edition)',
        targetPrice: 4200,
        currentPrice: 4499,
        userEmail: 'alex.vance@techspecs.org',
        notifyPush: true,
        createdAt: '2026-11-05',
        status: 'active'
      }
    ]);
  });

  // Currency
  const [currencyCode, setCurrencyCodeState] = useState<CurrencyCode>('USD');
  const currency = useMemo(() => {
    return CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];
  }, [currencyCode]);

  // Language
  const [language, setLanguageState] = useState<LanguageCode>('en');

  // Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('aether_theme');
    return saved !== null ? saved === 'dark' : true;
  });

  // Offline Simulation
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [isNetworkOnline, setIsNetworkOnline] = useState(navigator.onLine);
  const isOffline = !isNetworkOnline || isSimulatedOffline;

  // Encryption & Cloud Sync
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [deviceSynced, setDeviceSynced] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  // Current User
  const [currentUser, setCurrentUser] = useState<UserAccount>({
    id: 'usr-enthusiast-01',
    email: 'alex.vance@techspecs.org',
    name: 'Alex Vance',
    role: 'enthusiast',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    isAuthenticated: true,
    encryptionEnabled: false,
    deviceSynced: true,
    lastSyncedAt: '2026-11-06T11:45:00Z'
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    return StorageService.get<Order[]>(StorageService.KEYS.ORDERS, [
      {
        id: 'ORD-2026-8941',
        date: '2026-11-03',
        items: [
          {
            productId: 'razer-viper-v3-pro',
            name: 'Razer Viper V3 Pro Wireless Mouse',
            quantity: 1,
            priceUSD: 159,
            image: '/src/assets/images/product_flagship_mouse_1793994375536.jpg'
          }
        ],
        totalUSD: 159,
        currency: 'USD',
        totalInCurrency: 159,
        status: 'Delivered',
        trackingNumber: 'FDX-9942-8812',
        shippingAddress: {
          name: 'Alex Vance',
          address: '428 Silicon Boulevard, Suite 500',
          city: 'San Jose',
          country: 'United States',
          postalCode: '95113'
        },
        paymentMethod: 'Credit Card'
      }
    ]);
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Real-Time Inventory Alert',
      message: 'Razer Blade 18 NV-01 warehouse stock low: only 4 units remain.',
      type: 'stock_restock',
      timestamp: '10m ago',
      read: false,
      productId: 'razer-blade-18-2026'
    },
    {
      id: 'notif-2',
      title: 'Price Drop Radar Active',
      message: 'Tracking active for Wooting 80HE target $280.',
      type: 'price_drop',
      timestamp: '1h ago',
      read: false,
      productId: 'wooting-80he-rapid-trigger'
    }
  ]);

  // Modal routing
  const [activeModal, setActiveModal] = useState<AppContextType['activeModal']>(null);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [simulatorProductId, setSimulatorProductId] = useState<string | null>(null);

  // Sync dark class on documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('aether_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('aether_theme', 'light');
    }
  }, [isDarkMode]);

  // Network listeners
  useEffect(() => {
    const handleOnline = () => setIsNetworkOnline(true);
    const handleOffline = () => setIsNetworkOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save cart & watchlist
  useEffect(() => {
    StorageService.set(StorageService.KEYS.CART, cart);
  }, [cart]);

  useEffect(() => {
    StorageService.set(StorageService.KEYS.WATCHLIST, watchlist);
  }, [watchlist]);

  useEffect(() => {
    StorageService.set(StorageService.KEYS.ALERTS, priceAlerts);
  }, [priceAlerts]);

  useEffect(() => {
    StorageService.set(StorageService.KEYS.ORDERS, orders);
  }, [orders]);

  useEffect(() => {
    StorageService.set('aether_catalog_v1', products);
  }, [products]);

  // Simulated live stock ticker (every 14s updates a warehouse inventory or ETA)
  useEffect(() => {
    const interval = setInterval(() => {
      setProducts((prev) =>
        prev.map((p) => {
          // 20% chance to slightly adjust stock or ETA
          if (Math.random() < 0.25) {
            const stockDelta = Math.random() > 0.6 ? 1 : -1;
            const newStock = Math.max(1, p.stockCount + stockDelta);
            return {
              ...p,
              stockCount: newStock,
              restockEtaMinutes: p.stockCount <= 3 ? (p.restockEtaMinutes ? Math.max(15, p.restockEtaMinutes - 5) : 120) : null
            };
          }
          return p;
        })
      );
    }, 14000);

    return () => clearInterval(interval);
  }, []);

  // Price conversion helper
  const formatPrice = useCallback((amountUSD: number): string => {
    const converted = amountUSD * currency.rate;
    if (currency.code === 'JPY') {
      return `¥${Math.round(converted).toLocaleString()}`;
    }
    return `${currency.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }, [currency]);

  // Translation helper
  const t = useCallback((key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  }, [language]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleSimulatedOffline = () => setIsSimulatedOffline((prev) => !prev);

  // Cart operations
  const addToCart = (productId: string, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { productId, quantity, addedAt: Date.now() }];
    });

    const product = products.find((p) => p.id === productId);
    if (product) {
      addNotification(
        'Item Added to Manifest',
        `${product.name} (Qty: ${quantity}) has been added to your order manifest.`,
        'system',
        productId
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const cartTotalUSD = useMemo(() => {
    return cart.reduce((sum, item) => {
      const prod = products.find((p) => p.id === item.productId);
      return sum + (prod ? prod.price * item.quantity : 0);
    }, 0);
  }, [cart, products]);

  // Watchlist
  const toggleWatchlist = (productId: string, tag: WatchlistItem['tag'] = 'Dream Rig') => {
    setWatchlist((prev) => {
      const exists = prev.some((w) => w.productId === productId);
      if (exists) {
        return prev.filter((w) => w.productId !== productId);
      }
      return [...prev, { productId, tag, addedAt: new Date().toISOString().split('T')[0] }];
    });
  };

  const isInWatchlist = (productId: string) => watchlist.some((w) => w.productId === productId);

  // Comparison
  const toggleCompare = (productId: string) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        // Drop first and append
        return [...prev.slice(1), productId];
      }
      return [...prev, productId];
    });
  };

  const clearCompare = () => setCompareList([]);
  const isInCompare = (productId: string) => compareList.includes(productId);

  // Price Alerts
  const addPriceAlert = (productId: string, targetPrice: number, email = currentUser.email) => {
    const prod = products.find((p) => p.id === productId);
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      productId,
      productName: prod ? prod.name : 'Hardware Spec',
      targetPrice,
      currentPrice: prod ? prod.price : targetPrice,
      userEmail: email,
      notifyPush: true,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setPriceAlerts((prev) => [newAlert, ...prev]);
    StorageService.requestNotificationPermission();

    addNotification(
      'Price Radar Armed',
      `Target set for ${prod?.name}: Alert triggers at ${formatPrice(targetPrice)}.`,
      'price_drop',
      productId
    );
  };

  const removePriceAlert = (id: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const triggerSimulatedPriceDrop = () => {
    // Pick the first product and reduce its price to trigger alert
    if (products.length > 0) {
      const targetProd = products[0];
      const discountedPrice = Math.round(targetProd.price * 0.88);
      updateProductPrice(targetProd.id, discountedPrice);

      addNotification(
        'PRICE DROP ALERT: -12% OFF!',
        `${targetProd.name} dropped to ${formatPrice(discountedPrice)} (Was ${formatPrice(targetProd.price)})!`,
        'price_drop',
        targetProd.id
      );

      StorageService.sendNotification(`PRICE DROP: ${targetProd.name}`, {
        body: `Now ${formatPrice(discountedPrice)}! Immediate stock available.`
      });
    }
  };

  // Encryption toggle
  const toggleEncryption = async () => {
    const nextState = !isEncrypted;
    setIsEncrypted(nextState);
    if (nextState) {
      const payload = JSON.stringify(cart);
      const encrypted = await encryptData(payload);
      sessionStorage.setItem('aether_encrypted_vault', encrypted);
      addNotification(
        'AES-256 Storage Encryption Active',
        'Your user credentials, watchlists, and checkout cache are cryptographically protected.',
        'system'
      );
    }
  };

  // Cloud Sync
  const triggerCloudSync = () => {
    setDeviceSynced(false);
    setTimeout(() => {
      setDeviceSynced(true);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      addNotification(
        'Cloud Sync Completed',
        'All client preferences, cart manifest, and watchlists synchronized across iOS & Android nodes.',
        'system'
      );
    }, 800);
  };

  // User auth
  const loginAsDemoUser = (role: 'enthusiast' | 'admin' = 'enthusiast') => {
    setCurrentUser({
      id: role === 'admin' ? 'usr-admin-root' : 'usr-enthusiast-01',
      email: role === 'admin' ? 'lead.architect@aetherhardware.com' : 'alex.vance@techspecs.org',
      name: role === 'admin' ? 'Lead Systems Admin' : 'Alex Vance',
      role,
      avatar:
        role === 'admin'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      isAuthenticated: true,
      encryptionEnabled: isEncrypted,
      deviceSynced: true,
      lastSyncedAt: new Date().toISOString()
    });
  };

  const logoutUser = () => {
    setCurrentUser({
      id: 'guest',
      email: '',
      name: 'Guest Hardware Explorer',
      role: 'enthusiast',
      avatar: '',
      isAuthenticated: false,
      encryptionEnabled: false,
      deviceSynced: false,
      lastSyncedAt: ''
    });
  };

  // Place Order
  const placeOrder = async (
    shippingAddress: Order['shippingAddress'],
    paymentMethod: Order['paymentMethod']
  ): Promise<Order> => {
    const orderItems = cart.map((item) => {
      const prod = products.find((p) => p.id === item.productId)!;
      return {
        productId: item.productId,
        name: prod ? prod.name : 'Hardware Component',
        quantity: item.quantity,
        priceUSD: prod ? prod.price : 0,
        image: prod ? prod.image : ''
      };
    });

    const isCrypto = paymentMethod.includes('Crypto');
    const newOrder: Order = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      items: orderItems,
      totalUSD: cartTotalUSD,
      currency: currency.code,
      totalInCurrency: cartTotalUSD * currency.rate,
      status: isOffline ? 'Queued Offline' : 'Processing',
      trackingNumber: `AETH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      shippingAddress,
      paymentMethod,
      cryptoTxHash: isCrypto ? `0x7f${Math.random().toString(16).substring(2, 34)}` : undefined
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Deduct stock
    setProducts((prev) =>
      prev.map((prod) => {
        const item = cart.find((c) => c.productId === prod.id);
        if (item) {
          return {
            ...prod,
            stockCount: Math.max(0, prod.stockCount - item.quantity)
          };
        }
        return prod;
      })
    );

    clearCart();

    addNotification(
      isOffline ? 'Order Queued Offline' : 'Order Confirmed & Manifest Generated',
      isOffline
        ? `Order #${newOrder.id} stored locally in secure queue. Will dispatch when back online.`
        : `Order #${newOrder.id} confirmed. Tracking: ${newOrder.trackingNumber}`,
      'order_update'
    );

    return newOrder;
  };

  // Notifications helpers
  const addNotification = (
    title: string,
    message: string,
    type: AppNotification['type'],
    productId?: string
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
      productId
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 19)]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => setNotifications([]);

  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // Modal helpers
  const openProductModal = (productId: string) => {
    setActiveProductId(productId);
    setActiveModal('pdp');
  };

  const openSimulatorModal = (productId?: string) => {
    if (productId) {
      setSimulatorProductId(productId);
    } else if (!simulatorProductId && products.length > 0) {
      setSimulatorProductId(products[0].id);
    }
    setActiveModal('simulator');
  };

  const closeModals = () => {
    setActiveModal(null);
  };

  // Admin stock / price update
  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockCount: Math.max(0, newStock) } : p))
    );
    addNotification('Stock Level Adjusted', `Updated stock for ${productId} to ${newStock} units.`, 'stock_restock', productId);
  };

  const updateProductPrice = (productId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const history = [...p.priceHistory, { date: 'Today', price: newPrice }];
          return {
            ...p,
            price: newPrice,
            priceHistory: history
          };
        }
        return p;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartTotalUSD,
        watchlist,
        toggleWatchlist,
        isInWatchlist,
        compareList,
        toggleCompare,
        clearCompare,
        isInCompare,
        priceAlerts,
        addPriceAlert,
        removePriceAlert,
        triggerSimulatedPriceDrop,
        currency,
        setCurrencyCode: setCurrencyCodeState,
        formatPrice,
        language,
        setLanguageCode: setLanguageState,
        t,
        isDarkMode,
        toggleDarkMode,
        isOffline,
        toggleSimulatedOffline,
        isEncrypted,
        toggleEncryption,
        deviceSynced,
        lastSyncTime,
        triggerCloudSync,
        currentUser,
        loginAsDemoUser,
        logoutUser,
        orders,
        placeOrder,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        clearNotifications,
        addNotification,
        activeModal,
        setActiveModal,
        activeProductId,
        openProductModal,
        simulatorProductId,
        openSimulatorModal,
        closeModals,
        updateProductStock,
        updateProductPrice
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
