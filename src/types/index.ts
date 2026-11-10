export type ProductCategory = 'laptops' | 'keyboards' | 'mice' | 'monitors' | 'audio' | 'accessories';

export interface ProductSpecs {
  cpu?: string;
  gpu?: string;
  tgpWatts?: number;
  display?: string;
  displayType?: 'OLED' | 'QD-OLED' | 'Mini-LED' | 'IPS' | 'Retina XDR';
  refreshRateHz?: number;
  responseTimeMs?: number;
  ram?: string;
  storage?: string;
  cooling?: string;
  weightKg?: number;
  batteryWh?: number;
  switchType?: string;
  pollingRateHz?: number;
  sensor?: string;
  dimensions?: string;
  acousticTuning?: string;
  connectivity?: string[];
  batteryHours?: number;
}

export interface Benchmarks {
  geekbenchMulti?: number;
  geekbenchSingle?: number;
  cinebench2024?: number; // Multi-core
  cinebench2024Single?: number;
  timeSpyGraphics?: number;
  latencyClickMs?: number;
  batteryHours?: number;
  noiseDbaLoad?: number;
  thermalThrottlingPercent?: number;
  overallScore: number;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface ExpertVerdict {
  verdict: string;
  pros: string[];
  cons: string[];
  bestFor: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  role: string;
  rating: number;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
  testRig: string;
  helpfulCount: number;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: ProductCategory;
  price: number; // Base USD price
  originalPrice?: number;
  releaseYear: number;
  badge?: string;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  stockCount: number;
  warehouse: string;
  restockEtaMinutes: number | null;
  description: string;
  shortSummary: string;
  specs: ProductSpecs;
  benchmarks: Benchmarks;
  priceHistory: PricePoint[];
  expertVerdict: ExpertVerdict;
  reviews: Review[];
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // multiplier from USD
  format: string;
  flag: string;
}

export type LanguageCode = 'en' | 'de' | 'ja' | 'fr' | 'es';

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedConfig?: string;
  addedAt: number;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  targetPrice: number;
  currentPrice: number;
  userEmail: string;
  notifyPush: boolean;
  createdAt: string;
  status: 'active' | 'triggered';
}

export interface WatchlistItem {
  productId: string;
  tag: 'Dream Rig' | 'Desk Upgrade' | 'Workstation' | 'Under Observation';
  addedAt: string;
  note?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: 'enthusiast' | 'admin' | 'reviewer';
  avatar: string;
  isAuthenticated: boolean;
  encryptionEnabled: boolean;
  deviceSynced: boolean;
  lastSyncedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  priceUSD: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  totalUSD: number;
  currency: CurrencyCode;
  totalInCurrency: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Queued Offline';
  trackingNumber: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  paymentMethod: 'Credit Card' | 'Apple Pay' | 'Google Pay' | 'PayPal' | 'Crypto (Lightning)';
  cryptoTxHash?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'price_drop' | 'stock_restock' | 'order_update' | 'benchmark' | 'system';
  timestamp: string;
  read: boolean;
  productId?: string;
}
