import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'razer-blade-18-2026',
    name: 'Razer Blade 18 (2026 Edition)',
    slug: 'razer-blade-18-2026',
    brand: 'Razer',
    category: 'laptops',
    price: 4499,
    originalPrice: 4799,
    releaseYear: 2026,
    badge: 'Flagship Apex',
    image: '/src/assets/images/hero_flagship_laptop_1793994374037.jpg',
    gallery: [
      '/src/assets/images/hero_flagship_laptop_1793994374037.jpg',
    ],
    rating: 4.9,
    reviewCount: 38,
    stockCount: 4,
    warehouse: 'US West (NV-01)',
    restockEtaMinutes: 140,
    shortSummary: 'The undisputed desktop-replacement king with full 175W TGP RTX 4090 and 4K 200Hz Dual-Mode Mini-LED.',
    description: 'Forged from a single block of aerospace-grade T6 aluminum, the Razer Blade 18 packs desktop-class processing power into an ultra-rigid 21.9mm chassis. Featuring an innovative dual-mode 4K 200Hz / FHD+ 440Hz Mini-LED panel, an oversized vapor chamber with 3-fan active exhaust, and Thunderbolt 5 with 120Gbps bandwidth.',
    specs: {
      cpu: 'Intel Core i9-14900HX (24 Cores / 32 Threads, up to 5.8 GHz)',
      gpu: 'NVIDIA GeForce RTX 4090 Mobile (16GB GDDR6, 175W Max TGP)',
      tgpWatts: 175,
      display: '18.0" Dual-Mode 4K UHD+ (3840x2400) 200Hz / FHD+ 440Hz Mini-LED',
      displayType: 'Mini-LED',
      refreshRateHz: 200,
      responseTimeMs: 3.0,
      ram: '64GB DDR5-5600 Dual-Channel (expandable to 96GB)',
      storage: '4TB (2x 2TB) PCIe 4.0 NVMe M.2 SSD RAID 0',
      cooling: 'Full-Coverage Vapor Chamber + 3x 0.1mm Ultra-Thin Blade Fans',
      weightKg: 3.10,
      batteryWh: 91.7,
      batteryHours: 5.5,
      connectivity: ['Thunderbolt 5', 'HDMI 2.1 FRL', 'SD Card Reader UHS-II', 'Wi-Fi 7 (802.11be)', '2.5GbE RJ45']
    },
    benchmarks: {
      geekbenchSingle: 2980,
      geekbenchMulti: 18450,
      cinebench2024Single: 132,
      cinebench2024: 1980,
      timeSpyGraphics: 22400,
      latencyClickMs: 1.8,
      batteryHours: 5.5,
      noiseDbaLoad: 46.2,
      thermalThrottlingPercent: 0.0,
      overallScore: 98
    },
    priceHistory: [
      { date: 'Oct 01', price: 4799 },
      { date: 'Oct 10', price: 4799 },
      { date: 'Oct 20', price: 4699 },
      { date: 'Nov 01', price: 4599 },
      { date: 'Nov 06', price: 4499 }
    ],
    expertVerdict: {
      verdict: 'Phenomenal desktop replacement that sustained 175W GPU loads with zero thermal throttling in our 2-hour stress loop.',
      pros: [
        'Dual-Mode Mini-LED panel is the sharpest laptop screen ever tested (1000 nits peak)',
        'Thunderbolt 5 connectivity enables multi-display 8K and eGPU chaining',
        'Exceptional CNC unibody build quality with zero keyboard deck flex'
      ],
      cons: [
        'Substantial 3.1kg weight plus 330W GaN charger makes it heavy for commuter bags',
        'Premium price tag places it squarely in power-enthusiast tier'
      ],
      bestFor: 'High-end game developers, 3D visualization artists, and competitive gamers needing desktop power on the road.'
    },
    reviews: [
      {
        id: 'rev-101',
        productId: 'razer-blade-18-2026',
        author: 'Torsten M.',
        role: 'VFX Technical Director',
        rating: 5,
        title: 'Zero thermal throttling under 8K Unreal 5 renders',
        comment: 'Rendered an entire cinematic sequence in Unreal Engine 5.4 with Nanite and Lumen active. The 175W RTX 4090 held steady clocks around 2100MHz. The Mini-LED screen calibration out of the box was delta E < 1.1.',
        verifiedBuyer: true,
        testRig: 'Tested with: Dual 4K 144Hz monitors via TB5 dock',
        helpfulCount: 29,
        date: '2026-10-24'
      },
      {
        id: 'rev-102',
        productId: 'razer-blade-18-2026',
        author: 'Evelyn Reed',
        role: 'Competitive Sim Racer',
        rating: 5,
        title: 'Dual-mode switch works instantaneously',
        comment: 'I use 4K 200Hz for flight simulation and toggle to 440Hz FHD for esports shooters. Keyboard latency feels identical to my desktop mechanical rig.',
        verifiedBuyer: true,
        testRig: 'Tested with: Fanatec DD Pro + 2.5G LAN',
        helpfulCount: 14,
        date: '2026-11-02'
      }
    ]
  },
  {
    id: 'wooting-80he-rapid-trigger',
    name: 'Wooting 80HE Hall Effect Keyboard',
    slug: 'wooting-80he-rapid-trigger',
    brand: 'Wooting',
    category: 'keyboards',
    price: 289,
    originalPrice: 319,
    releaseYear: 2026,
    badge: 'Pro Tier Pick',
    image: '/src/assets/images/product_wooting_keyboard_1793994374460.jpg',
    gallery: [
      '/src/assets/images/product_wooting_keyboard_1793994374460.jpg'
    ],
    rating: 5.0,
    reviewCount: 94,
    stockCount: 12,
    warehouse: 'EU Central (FRA-02)',
    restockEtaMinutes: null,
    shortSummary: 'True 8000Hz polling rate with Lekker L60 magnetic analog switches and 0.1mm Rapid Trigger accuracy.',
    description: 'The pinnacle of competitive input engineering. The Wooting 80HE delivers continuous analog key travel sensing via Hall effect magnetic sensors. Features "Rappy Snappy" and "Snappy Tappy" dual-input priority, 8000Hz USB polling, screw-in PCR stabilizers, and a gasket-mounted sound-dampened PCR plate.',
    specs: {
      switchType: 'Lekker L60 Magnetic Hall Effect (Analog Adjustable 0.1mm - 4.0mm)',
      pollingRateHz: 8000,
      responseTimeMs: 0.125,
      dimensions: '354 x 136 x 38 mm (80% Layout)',
      weightKg: 1.15,
      connectivity: ['Detachable Braided USB-C (8000Hz Low Jitter)'],
      cooling: 'Passive Gasket Silicone Dampener',
    },
    benchmarks: {
      latencyClickMs: 0.12,
      noiseDbaLoad: 38.0,
      overallScore: 99
    },
    priceHistory: [
      { date: 'Oct 01', price: 319 },
      { date: 'Oct 15', price: 299 },
      { date: 'Nov 01', price: 289 },
      { date: 'Nov 06', price: 289 }
    ],
    expertVerdict: {
      verdict: 'The definitive standard for esports and mechanical enthusiasts. Zero debounce delay transforms directional counter-strafing.',
      pros: [
        '0.1mm Rapid Trigger sensitivity gives an unbeatable competitive advantage',
        'Web-based Wootility driver requires zero bloated background software',
        'Frosted polycarbonate housing with gasket mounting provides a deep, thocky sound signature'
      ],
      cons: [
        'Wired-only configuration to guarantee true 8000Hz zero-packet-drop integrity'
      ],
      bestFor: 'Competitive FPS players (Valorant, CS2, Apex) and custom keyboard enthusiasts.'
    },
    reviews: [
      {
        id: 'rev-201',
        productId: 'wooting-80he-rapid-trigger',
        author: 'Dmitri K.',
        role: 'Pro Esports Coach',
        rating: 5,
        title: 'Counter-strafing precision cannot be beaten',
        comment: 'Every player on our roster switched to the 80HE. The analog reset point means instantaneous stop-and-shoot mechanics without waiting for physical spring rebound.',
        verifiedBuyer: true,
        testRig: 'Tested with: 8000Hz polling on AMD Ryzen 9 9950X',
        helpfulCount: 42,
        date: '2026-10-18'
      }
    ]
  },
  {
    id: 'asus-rog-swift-pg32ucdm',
    name: 'ASUS ROG Swift PG32UCDM 32" QD-OLED',
    slug: 'asus-rog-swift-pg32ucdm',
    brand: 'ASUS ROG',
    category: 'monitors',
    price: 1299,
    originalPrice: 1399,
    releaseYear: 2026,
    badge: 'Hardware Award',
    image: '/src/assets/images/product_ultrawide_oled_1793994375852.jpg',
    gallery: [
      '/src/assets/images/product_ultrawide_oled_1793994375852.jpg'
    ],
    rating: 4.9,
    reviewCount: 67,
    stockCount: 6,
    warehouse: 'US West (NV-01)',
    restockEtaMinutes: 90,
    shortSummary: '32-inch 4K UHD QD-OLED with blistering 240Hz refresh, 0.03ms GTG response, and custom passive graphene heatsink.',
    description: 'Combining third-generation Quantum Dot OLED technology with 4K clarity (140 PPI), the PG32UCDM produces pure ink blacks and 1000 nits peak luminance with 99% DCI-P3 gamut coverage. Built with a custom heatsink and graphene film to prevent burn-in without noisy cooling fans.',
    specs: {
      display: '31.5" QD-OLED 4K (3840 x 2160) 16:9',
      displayType: 'QD-OLED',
      refreshRateHz: 240,
      responseTimeMs: 0.03,
      weightKg: 8.8,
      dimensions: '718 x 579 x 274 mm with stand',
      connectivity: ['DisplayPort 1.4 (DSC)', '2x HDMI 2.1 (48Gbps)', 'USB-C with 90W Power Delivery', 'SPDIF Optical']
    },
    benchmarks: {
      overallScore: 97,
      latencyClickMs: 0.8,
      noiseDbaLoad: 0.0 // 100% silent graphene passive
    },
    priceHistory: [
      { date: 'Oct 01', price: 1399 },
      { date: 'Oct 18', price: 1349 },
      { date: 'Nov 02', price: 1299 },
      { date: 'Nov 06', price: 1299 }
    ],
    expertVerdict: {
      verdict: 'The current endgame 4K gaming monitor. The jump in text clarity over Gen-1 OLED panels makes it an extraordinary dual-purpose workstation display.',
      pros: [
        '0.03ms instantaneous pixel response eliminates ghosting entirely',
        'Sub-pixel rendering update delivers crisp typography for coding and text work',
        'Silent operation thanks to copper backplate and graphene thermal design'
      ],
      cons: [
        'Requires top-tier GPU (RTX 4080/4090) to drive 4K at 240FPS'
      ],
      bestFor: 'Discerning PC enthusiasts wanting the best HDR gaming and color-accurate video editing in a single display.'
    },
    reviews: [
      {
        id: 'rev-301',
        productId: 'asus-rog-swift-pg32ucdm',
        author: 'Liam Vance',
        role: 'Colorist & Hardware Editor',
        rating: 5,
        title: 'Zero text fringing and flawless motion clarity',
        comment: 'Third-gen QD-OLED solved the triangular subpixel fringing. HDR highlights pop with astonishing contrast. 90W USB-C powers my laptop when doing daytime productivity.',
        verifiedBuyer: true,
        testRig: 'Tested with: RTX 4090 via DP 1.4 DSC',
        helpfulCount: 51,
        date: '2026-10-30'
      }
    ]
  },
  {
    id: 'razer-viper-v3-pro',
    name: 'Razer Viper V3 Pro Wireless Mouse',
    slug: 'razer-viper-v3-pro',
    brand: 'Razer',
    category: 'mice',
    price: 159,
    originalPrice: 179,
    releaseYear: 2026,
    badge: 'Esports Champion',
    image: '/src/assets/images/product_flagship_mouse_1793994375536.jpg',
    gallery: [
      '/src/assets/images/product_flagship_mouse_1793994375536.jpg'
    ],
    rating: 4.8,
    reviewCount: 112,
    stockCount: 19,
    warehouse: 'Tokyo Hub (TYO-04)',
    restockEtaMinutes: null,
    shortSummary: '54-gram symmetrical esports mouse equipped with Focus Pro 35K Gen-2 Optical sensor and native true 8000Hz wireless polling.',
    description: 'Engineered in collaboration with tier-1 esports professionals. The Viper V3 Pro achieves an ultralight 54g weight without structural honeycomb perforations. Equipped with Gen-3 Optical Mouse Switches rated for 90M clicks and the HyperPolling Wireless Dongle delivering true 8000Hz update rates.',
    specs: {
      sensor: 'Focus Pro 35K Gen-2 Optical (35,000 DPI, 750 IPS, 70G Acceleration)',
      pollingRateHz: 8000,
      responseTimeMs: 0.125,
      weightKg: 0.054,
      batteryHours: 95,
      switchType: 'Optical Mouse Switches Gen-3 (90 Million Clicks)',
      connectivity: ['HyperSpeed 8000Hz Wireless Dongle', 'Speedflex USB-C']
    },
    benchmarks: {
      latencyClickMs: 0.15,
      batteryHours: 95,
      overallScore: 96
    },
    priceHistory: [
      { date: 'Oct 01', price: 179 },
      { date: 'Oct 14', price: 169 },
      { date: 'Nov 01', price: 159 },
      { date: 'Nov 06', price: 159 }
    ],
    expertVerdict: {
      verdict: 'The pinnacle of competitive mouse tracking. 8000Hz wireless paired with flawless weight distribution and balanced PTFE glides.',
      pros: [
        '54g solid-shell construction feels rock solid with zero creak',
        '8000Hz wireless tracking provides micro-flick smoothness on 240Hz+ monitors',
        'Large zero-additive PTFE feet glide with uniform friction'
      ],
      cons: [
        '8000Hz polling rate reduces battery life from 95 hours down to ~17 hours'
      ],
      bestFor: 'Pro and aspiring esports players who want maximum sensor fidelity and zero cable drag.'
    },
    reviews: [
      {
        id: 'rev-401',
        productId: 'razer-viper-v3-pro',
        author: 'Sora N.',
        role: 'Immortal Rank Duelist',
        rating: 5,
        title: 'Glide and click responsiveness are second to none',
        comment: 'Upgraded from the V2 Pro. The subtle hump shape change supports relaxed claw grip significantly better. Clicks have a crisp, reassuring tactile break.',
        verifiedBuyer: true,
        testRig: 'Tested with: Artisan Hayate Otsu XSoft pad',
        helpfulCount: 33,
        date: '2026-11-04'
      }
    ]
  },
  {
    id: 'asus-rog-zephyrus-g16-oled',
    name: 'ASUS ROG Zephyrus G16 OLED (2026)',
    slug: 'asus-rog-zephyrus-g16-oled',
    brand: 'ASUS ROG',
    category: 'laptops',
    price: 3299,
    originalPrice: 3499,
    releaseYear: 2026,
    badge: 'Ultra-Portable',
    image: '/src/assets/images/hero_flagship_laptop_1793994374037.jpg',
    gallery: [
      '/src/assets/images/hero_flagship_laptop_1793994374037.jpg'
    ],
    rating: 4.8,
    reviewCount: 42,
    stockCount: 5,
    warehouse: 'EU Central (FRA-02)',
    restockEtaMinutes: 210,
    shortSummary: 'CNC-machined aluminum powerhouse packing Intel Core Ultra 9 285H and 2.5K 240Hz 0.2ms ROG Nebula OLED.',
    description: 'Weighing only 1.85kg with a slim 14.9mm profile, the Zephyrus G16 features a custom vapor chamber with liquid metal thermal compound, 240Hz OLED display with VESA DisplayHDR True Black 500, and 6-speaker spatial audio.',
    specs: {
      cpu: 'Intel Core Ultra 9 285H (16 Cores, Intel AI Boost NPU)',
      gpu: 'NVIDIA GeForce RTX 4090 Mobile (115W TGP + Dynamic Boost)',
      tgpWatts: 115,
      display: '16.0" 2.5K (2560x1600) 240Hz OLED ROG Nebula Display',
      displayType: 'OLED',
      refreshRateHz: 240,
      responseTimeMs: 0.2,
      ram: '32GB LPDDR5X-7467 Onboard',
      storage: '2TB PCIe 4.0 NVMe M.2 SSD',
      cooling: 'Vapor Chamber + Liquid Metal on CPU & GPU + 2nd Gen Arc Flow Fans',
      weightKg: 1.85,
      batteryWh: 90.0,
      batteryHours: 8.5,
      connectivity: ['Thunderbolt 4', 'USB 3.2 Gen 2 Type-C', 'HDMI 2.1', 'SD Express 7.0']
    },
    benchmarks: {
      geekbenchSingle: 2910,
      geekbenchMulti: 16200,
      cinebench2024Single: 126,
      cinebench2024: 1680,
      timeSpyGraphics: 17800,
      latencyClickMs: 2.1,
      batteryHours: 8.5,
      noiseDbaLoad: 41.5,
      thermalThrottlingPercent: 4.2,
      overallScore: 94
    },
    priceHistory: [
      { date: 'Oct 01', price: 3499 },
      { date: 'Oct 22', price: 3399 },
      { date: 'Nov 06', price: 3299 }
    ],
    expertVerdict: {
      verdict: 'The best all-around portable gaming laptop on the market. Incredible screen, stellar speakers, and MacBook-rivaling aluminum finish.',
      pros: [
        'Gorgeous 240Hz 0.2ms OLED panel with true deep blacks',
        'Ultra-light 1.85kg chassis for 16-inch high-performance hardware',
        '8+ hours of real-world productivity battery life'
      ],
      cons: [
        '115W TGP runs slightly below 175W thick desktop replacements',
        'Soldered LPDDR5X memory cannot be upgraded post-purchase'
      ],
      bestFor: 'Creative professionals and travel-oriented gamers who refuse to carry heavy bricks.'
    },
    reviews: [
      {
        id: 'rev-501',
        productId: 'asus-rog-zephyrus-g16-oled',
        author: 'Marcus Lind',
        role: 'Indie Game Architect',
        rating: 5,
        title: 'Finally a Windows laptop with MacBook tier build quality',
        comment: 'The trackpad is enormous and smooth as glass. OLED panel is breathtaking for both color-grading HDR footage and high-refresh gaming.',
        verifiedBuyer: true,
        testRig: 'Tested with: Dual external studio monitors',
        helpfulCount: 22,
        date: '2026-10-28'
      }
    ]
  },
  {
    id: 'apple-macbook-pro-16-m4-max',
    name: 'Apple MacBook Pro 16" (M4 Max)',
    slug: 'apple-macbook-pro-16-m4-max',
    brand: 'Apple',
    category: 'laptops',
    price: 3999,
    originalPrice: 4299,
    releaseYear: 2026,
    badge: 'Creator Standard',
    image: '/src/assets/images/hero_flagship_laptop_1793994374037.jpg',
    gallery: [
      '/src/assets/images/hero_flagship_laptop_1793994374037.jpg'
    ],
    rating: 4.9,
    reviewCount: 55,
    stockCount: 8,
    warehouse: 'US West (NV-01)',
    restockEtaMinutes: null,
    shortSummary: '16-core CPU, 40-core GPU, 128GB unified memory delivering up to 22 hours battery endurance and 1600 nits peak Liquid Retina XDR.',
    description: 'Built for intense computational workloads, local LLM inference, and multi-stream 8K ProRes video editing. Delivers identical computational throughput whether plugged in or operating on battery power.',
    specs: {
      cpu: 'Apple M4 Max (16-Core CPU: 12 Performance + 4 Efficiency)',
      gpu: 'Apple M4 Max 40-Core GPU with Hardware Ray Tracing',
      tgpWatts: 85,
      display: '16.2" Liquid Retina XDR (3456x2234) 120Hz ProMotion Mini-LED',
      displayType: 'Retina XDR',
      refreshRateHz: 120,
      responseTimeMs: 8.0,
      ram: '128GB Unified Memory (546GB/s Bandwidth)',
      storage: '2TB High-Speed Unified NVMe',
      cooling: 'Whisper-Quiet Dual High-Pressure Blower Fans',
      weightKg: 2.14,
      batteryWh: 100.0,
      batteryHours: 22.0,
      connectivity: ['3x Thunderbolt 5 (USB-C)', 'HDMI 2.1', 'SDXC Card Slot', 'MagSafe 3', '3.5mm Headphone Jack']
    },
    benchmarks: {
      geekbenchSingle: 3920,
      geekbenchMulti: 24800,
      cinebench2024Single: 178,
      cinebench2024: 2150,
      timeSpyGraphics: 21500,
      latencyClickMs: 2.8,
      batteryHours: 22.0,
      noiseDbaLoad: 28.5,
      thermalThrottlingPercent: 0.5,
      overallScore: 99
    },
    priceHistory: [
      { date: 'Oct 01', price: 4299 },
      { date: 'Oct 20', price: 4149 },
      { date: 'Nov 06', price: 3999 }
    ],
    expertVerdict: {
      verdict: 'An engineering marvel. No other machine on the planet can run massive 70B parameter LLMs locally at full speed while unplugged on a flight.',
      pros: [
        '128GB unified memory with 546GB/s bandwidth runs huge local models effortlessly',
        '22 hours battery life dwarfs all x86 competitors',
        'Virtually inaudible cooling even under 100% sustained CPU render'
      ],
      cons: [
        'macOS ecosystem has fewer native DirectX 12 games than Windows'
      ],
      bestFor: 'AI researchers, software architects, film editors, and mobile power users.'
    },
    reviews: [
      {
        id: 'rev-601',
        productId: 'apple-macbook-pro-16-m4-max',
        author: 'Dr. Aris Chen',
        role: 'Machine Learning Scientist',
        rating: 5,
        title: 'Running 70B Quantized models at 28 tokens/sec on battery',
        comment: 'The unified memory architecture is a gamechanger. I can train adapters and run inference locally anywhere in the world without looking for a power outlet.',
        verifiedBuyer: true,
        testRig: 'Tested with: Llama 3 70B Q4_K_M',
        helpfulCount: 39,
        date: '2026-10-15'
      }
    ]
  },
  {
    id: 'sennheiser-hd-490-pro-plus',
    name: 'Sennheiser HD 490 Pro Plus Studio Reference',
    slug: 'sennheiser-hd-490-pro-plus',
    brand: 'Sennheiser',
    category: 'audio',
    price: 479,
    originalPrice: 519,
    releaseYear: 2026,
    badge: 'Audiophile Spec',
    image: '/src/assets/images/product_wooting_keyboard_1793994374460.jpg',
    gallery: [
      '/src/assets/images/product_wooting_keyboard_1793994374460.jpg'
    ],
    rating: 4.9,
    reviewCount: 29,
    stockCount: 14,
    warehouse: 'EU Central (FRA-02)',
    restockEtaMinutes: null,
    shortSummary: 'Open-back professional studio headphones featuring Dearman open acoustic architecture and dual-pad tuning system for surgical spatial audio.',
    description: 'Designed for mastering engineers and audio-obsessed competitive gamers who demand surgical acoustic imaging and zero harmonic distortion. Includes both Velour (Producing) and Fabric (Mixing) swappable ear pads, a balanced neodymium driver system, and dearVR SPATIAL 3D plugin license.',
    specs: {
      acousticTuning: 'Open-Back Dynamic with Dearman Flow Architecture (5 Hz - 36,000 Hz)',
      weightKg: 0.26,
      dimensions: 'Custom Ergonomic Suspension Headband',
      connectivity: ['Detachable 1.8m and 3.0m coiled cable with mini-XLR to 3.5mm / 6.3mm adapter'],
      switchType: '38mm Dynamic Neodymium Transducers with 130 Ohm Impedance'
    },
    benchmarks: {
      overallScore: 95,
      noiseDbaLoad: 0.0
    },
    priceHistory: [
      { date: 'Oct 01', price: 519 },
      { date: 'Oct 19', price: 499 },
      { date: 'Nov 06', price: 479 }
    ],
    expertVerdict: {
      verdict: 'Unmatched 3D spatial staging. In competitive games, footsteps and pin drops can be located with millimeter accuracy.',
      pros: [
        'Extremely lightweight 260g design allows 8+ hours sessions without ear fatigue',
        'Dual washable ear pads provide distinct warm vs analytical frequency responses',
        'Detachable mini-XLR cables can be plugged into either left or right earcup'
      ],
      cons: [
        'Open-back design leaks sound in noisy room environments',
        '130 ohm impedance benefits from a dedicated DAC/Amp for maximum headroom'
      ],
      bestFor: 'Music producers, streamers, and gamers wanting flawless directional imaging.'
    },
    reviews: [
      {
        id: 'rev-701',
        productId: 'sennheiser-hd-490-pro-plus',
        author: 'Julian Thorne',
        role: 'Sound Designer',
        rating: 5,
        title: 'Pinpoint acoustic imaging in complex games',
        comment: 'Paired with a Schiit Magni amp. The soundstage is vast yet pin-sharp. The fabric pads provide an exceptionally flat response with no bloated bass bleed.',
        verifiedBuyer: true,
        testRig: 'Tested with: Schiit Magni + Modi DAC',
        helpfulCount: 18,
        date: '2026-10-21'
      }
    ]
  },
  {
    id: 'artisan-hien-fx-mid',
    name: 'Artisan Hien FX Mid (Black XL)',
    slug: 'artisan-hien-fx-mid',
    brand: 'Artisan Japan',
    category: 'accessories',
    price: 79,
    originalPrice: 89,
    releaseYear: 2026,
    badge: 'Artisan Import',
    image: '/src/assets/images/product_flagship_mouse_1793994375536.jpg',
    gallery: [
      '/src/assets/images/product_flagship_mouse_1793994375536.jpg'
    ],
    rating: 5.0,
    reviewCount: 88,
    stockCount: 7,
    warehouse: 'Tokyo Hub (TYO-04)',
    restockEtaMinutes: 60,
    shortSummary: 'Imported Japanese artisanal hybrid micro-weave gaming surface with high stopping power and zero stitch irritation.',
    description: 'Renowned worldwide in the enthusiast peripheral scene. The Artisan Hien features an irregular amundsen fabric weave that offers low initial static friction for instantaneous tracking adjustments, paired with strong stopping power. The stitched FX edge is lower than the glide surface.',
    specs: {
      dimensions: '490 x 420 x 4.0 mm (XL Size)',
      weightKg: 0.38,
      switchType: 'Single-Cell Special Poron Foam Base (Mid Hardness)',
      sensor: 'Hybrid Amundsen Weave Surface (Rough Texture, High Durability)'
    },
    benchmarks: {
      overallScore: 98
    },
    priceHistory: [
      { date: 'Oct 01', price: 89 },
      { date: 'Nov 01', price: 79 },
      { date: 'Nov 06', price: 79 }
    ],
    expertVerdict: {
      verdict: 'The gold standard against which all other gaming mouse surfaces are judged. Virtually immune to humidity changes.',
      pros: [
        'Porous Poron base adheres like a suction cup to desk surfaces',
        'Amundsen weave never slows down with arm humidity or sweat',
        'Zero edge fraying over years of competitive play'
      ],
      cons: [
        'Distinct textured weave takes 2-3 days of muscle memory adaptation'
      ],
      bestFor: 'Tactical and tracking FPS players seeking consistency across seasons.'
    },
    reviews: [
      {
        id: 'rev-801',
        productId: 'artisan-hien-fx-mid',
        author: 'Kenji T.',
        role: 'Aim Trainer Specialist',
        rating: 5,
        title: 'Unbelievable desk grip and micro-adjustment control',
        comment: 'I own over 20 mousepads. The Hien Mid is the only one that remains 100% consistent through summer and winter without muddy spots.',
        verifiedBuyer: true,
        testRig: 'Tested with: Glass & PTFE mouse skates',
        helpfulCount: 47,
        date: '2026-10-12'
      }
    ]
  },
  {
    id: 'raspberry-pi-5-8gb',
    name: 'Raspberry Pi 5 (8GB) Official Flagship Kit',
    slug: 'raspberry-pi-5-8gb',
    brand: 'Raspberry Pi',
    category: 'sbc',
    price: 119,
    originalPrice: 135,
    releaseYear: 2026,
    badge: 'Hardware SBC Apex',
    image: '/src/assets/images/raspberry_pi_5_1794348153186.jpg',
    gallery: [
      '/src/assets/images/raspberry_pi_5_1794348153186.jpg'
    ],
    rating: 4.9,
    reviewCount: 142,
    stockCount: 18,
    warehouse: 'US West (NV-01)',
    restockEtaMinutes: null,
    shortSummary: 'The new standard in single-board computing with 2.4GHz quad-core ARM Cortex-A76, PCIe 2.0 NVMe expansion, and active cooling.',
    description: 'Boasting 2–3x the processing power of its predecessor, the Raspberry Pi 5 8GB is engineered on Broadcom’s BCM2712 silicon. It introduces an on-board PCIe 2.0 interface for blazing-fast NVMe solid-state storage, dual 4Kp60 micro-HDMI outputs with HDR support, and custom RP1 I/O southbridge delivering 5Gbps USB throughput.',
    specs: {
      cpu: 'Broadcom BCM2712 (Quad-core 64-bit Arm Cortex-A76 @ 2.4 GHz, 512KB L2 per core, 2MB shared L3)',
      gpu: 'VideoCore VII GPU @ 800 MHz (OpenGL ES 3.1, Vulkan 1.2)',
      ram: '8GB LPDDR4X-4267 High-Density SDRAM',
      storage: 'MicroSD slot with SDR104 support + PCIe 2.0 x1 FPC (Supports M.2 NVMe SSD HAT)',
      cooling: 'Official Raspberry Pi Active Cooler (Aluminum Heatsink + PWM Blower Fan)',
      weightKg: 0.065,
      connectivity: ['Dual 4Kp60 micro-HDMI', 'PCIe 2.0 x1 FPC', '2x USB 3.0 (5Gbps simultaneous)', '2x USB 2.0', 'Gigabit Ethernet PoE+', 'Wi-Fi 5 (802.11ac)', 'Bluetooth 5.0 BLE', '40-pin GPIO']
    },
    benchmarks: {
      geekbenchSingle: 795,
      geekbenchMulti: 1740,
      overallScore: 94
    },
    priceHistory: [
      { date: 'Oct 01', price: 135 },
      { date: 'Oct 20', price: 125 },
      { date: 'Nov 01', price: 119 }
    ],
    expertVerdict: {
      verdict: 'The desktop-class microcomputer revolution. With PCIe NVMe enabled, cold-boots Raspberry Pi OS in under 4 seconds.',
      pros: [
        'PCIe lane enables >800MB/s NVMe storage throughput via M.2 HAT',
        'Official active cooler keeps BCM2712 under 58°C even under full compiler saturation',
        'Dual 4Kp60 display support transforms it into a viable lightweight workstation'
      ],
      cons: [
        'Requires 27W 5V/5A USB-PD power supply for full 1.6A USB peripheral current'
      ],
      bestFor: 'Self-hosting home labs, edge computing, robotics, and hardware automation architects.'
    },
    reviews: [
      {
        id: 'rev-pi-1',
        productId: 'raspberry-pi-5-8gb',
        author: 'Julian Thorne',
        role: 'Edge Computing Architect',
        rating: 5,
        title: 'Running 12 Docker containers and Home Assistant with 0 lag',
        comment: 'Paired this with an NVMe boot drive via the M.2 HAT. Read speeds hit 850 MB/s. Memory headroom with 8GB is massive for local Ollama LLM testing.',
        verifiedBuyer: true,
        testRig: 'Tested with: 1TB Samsung 980 NVMe + 27W Official PSU',
        helpfulCount: 53,
        date: '2026-11-04'
      }
    ]
  },
  {
    id: 'raspberry-pi-ai-kit',
    name: 'Raspberry Pi 5 AI Kit (13 TOPS Hailo-8L + M.2 HAT+)',
    slug: 'raspberry-pi-ai-kit',
    brand: 'Raspberry Pi',
    category: 'sbc',
    price: 189,
    originalPrice: 215,
    releaseYear: 2026,
    badge: 'Neural Accelerator',
    image: '/src/assets/images/raspberry_pi_ai_kit_1794348179468.jpg',
    gallery: [
      '/src/assets/images/raspberry_pi_ai_kit_1794348179468.jpg'
    ],
    rating: 4.8,
    reviewCount: 46,
    stockCount: 9,
    warehouse: 'US West (NV-01)',
    restockEtaMinutes: null,
    shortSummary: 'Integrated neural network accelerator HAT packing 13 Tera-Operations per Second for real-time vision AI and object tracking.',
    description: 'Transform your Raspberry Pi 5 into an industrial edge AI powerhouse. Features an M.2 2242 form-factor Hailo-8L AI accelerator module mounted on the Raspberry Pi M.2 HAT+. Delivers 13 TOPS of neural inference throughput for YOLOv8, pose estimation, and semantic segmentation with ultra-low thermal dissipation.',
    specs: {
      cpu: 'Hailo-8L Neural Processing Unit (NPU) @ 13 TOPS Compute Capacity',
      ram: 'Shared with host Pi 5 (Optimized zero-copy frame buffer)',
      storage: 'PCIe Gen 3.0 M.2 2242 Form Factor',
      cooling: 'Direct-contact Aluminum Thermal Fin Block with Pre-applied Phase-Change Pad',
      weightKg: 0.045,
      connectivity: ['PCIe 3.0 x1 FPC interface', 'Raspberry Pi Camera Module 3 CSI Integration']
    },
    benchmarks: {
      overallScore: 97
    },
    priceHistory: [
      { date: 'Oct 15', price: 215 },
      { date: 'Nov 01', price: 189 }
    ],
    expertVerdict: {
      verdict: 'Phenomenal 13 TOPS inference efficiency. Executes YOLOv8 real-time object classification at 60 FPS while consuming under 2.5 Watts.',
      pros: [
        'Massive 13 TOPS compute density in a compact HAT format',
        'Seamless integration with libcamera and Picamera2 frameworks',
        'Pre-trained model zoo available out of the box with zero compiler friction'
      ],
      cons: [
        'Dedicated to inference workloads (training still best executed on workstation GPUs)'
      ],
      bestFor: 'Computer vision engineers, autonomous robotics builders, and smart security architects.'
    },
    reviews: [
      {
        id: 'rev-pi-ai-1',
        productId: 'raspberry-pi-ai-kit',
        author: 'Dr. Marcus Vance',
        role: 'Robotics Lab Director',
        rating: 5,
        title: '60 FPS multi-stream object tracking with cold thermals',
        comment: 'Runs YOLOv8n at 60+ FPS on 1080p camera feed without burdening the Pi 5 Cortex-A76 cores. CPU usage sits at merely 12%. Game changer for embedded robotics.',
        verifiedBuyer: true,
        testRig: 'Tested with: Pi Camera Module 3 Wide + Pi 5 8GB',
        helpfulCount: 31,
        date: '2026-11-06'
      }
    ]
  },
  {
    id: 'flipper-zero-multitool',
    name: 'Flipper Zero Multi-Tool & Cyber Companion',
    slug: 'flipper-zero-multitool',
    brand: 'Flipper Devices',
    category: 'cybersec',
    price: 169,
    originalPrice: 199,
    releaseYear: 2026,
    badge: 'Hardware Cyber Apex',
    image: '/src/assets/images/flipper_zero_1794348166934.jpg',
    gallery: [
      '/src/assets/images/flipper_zero_1794348166934.jpg'
    ],
    rating: 4.9,
    reviewCount: 310,
    stockCount: 14,
    warehouse: 'US West (NV-01)',
    restockEtaMinutes: null,
    shortSummary: 'The portable multi-tool for geeks and hardware penetration testers with Sub-1 GHz, RFID, NFC, Infrared, and GPIO expansion.',
    description: 'The iconic cyber tool housed in an ultra-rugged shell with a cheerful cyber-dolphin personality. Flipper Zero combines Sub-1 GHz RF transceiver (300-928 MHz), 125 kHz RFID reader/emulator, 13.56 MHz NFC with full Mifare support, infrared transmitter with exhaustive appliance dictionary, and hardware GPIO headers for UART, SPI, and I2C exploration.',
    specs: {
      cpu: 'Dual-Core STM32WB55RG (ARM Cortex-M4 64MHz + Cortex-M0+ 32MHz dedicated radio core)',
      display: '1.4" Sunlight-Readable Monochrome 128x64 LCD with Warm Orange Backlight (0.4W power)',
      batteryWh: 7.77,
      batteryHours: 168.0,
      weightKg: 0.102,
      connectivity: ['Sub-1 GHz CC1101 (300-928 MHz)', '125 kHz RFID', '13.56 MHz NFC', 'Infrared RX/TX', '18-pin 3.3V/5V GPIO Header', 'USB 2.0 Type-C (Virtual COM / DFU / HID)', 'Bluetooth 5.0 LE']
    },
    benchmarks: {
      overallScore: 99
    },
    priceHistory: [
      { date: 'Oct 01', price: 199 },
      { date: 'Oct 20', price: 179 },
      { date: 'Nov 01', price: 169 }
    ],
    expertVerdict: {
      verdict: 'The Swiss Army knife of hardware protocol exploration. Intuitive tactile controls, rock-solid firmware, and open-source ecosystem.',
      pros: [
        'Unmatched protocol versatility: Sub-GHz, RFID, NFC, Infrared, and 1-Wire in one pocket device',
        'Monochrome LCD provides flawless outdoor readability in direct sun with 7-day battery life',
        'Thriving open-source community with endless firmware addons and expansion boards'
      ],
      cons: [
        'Requires MicroSD card (FAT32) for storage of frequency files and payloads'
      ],
      bestFor: 'Cybersecurity researchers, hardware hackers, IoT developers, and access control auditors.'
    },
    reviews: [
      {
        id: 'rev-flip-1',
        productId: 'flipper-zero-multitool',
        author: 'Soren Lind',
        role: 'Penetration Tester & Red Teamer',
        rating: 5,
        title: 'Essential everyday carry tool for physical security audits',
        comment: 'Replaced an entire bag of bulky SDR dongles and RFID cloners. The built-in BadUSB engine and GPIO logic analyzer make bench testing effortless.',
        verifiedBuyer: true,
        testRig: 'Tested with: Official Silicone Bumper + 64GB SanDisk Extreme',
        helpfulCount: 78,
        date: '2026-10-30'
      }
    ]
  },
  {
    id: 'flipper-zero-wifi-devboard',
    name: 'Flipper Zero Wi-Fi Developer Board v1 (ESP32-S2)',
    slug: 'flipper-zero-wifi-devboard',
    brand: 'Flipper Devices',
    category: 'cybersec',
    price: 39,
    originalPrice: 45,
    releaseYear: 2026,
    badge: 'Hardware Addon',
    image: '/src/assets/images/flipper_wifi_board_1794348191469.jpg',
    gallery: [
      '/src/assets/images/flipper_wifi_board_1794348191469.jpg'
    ],
    rating: 4.8,
    reviewCount: 92,
    stockCount: 22,
    warehouse: 'US West (NV-01)',
    restockEtaMinutes: null,
    shortSummary: 'Official expansion module equipped with ESP32-S2 for in-circuit debugging, wireless firmware flashing, and 2.4GHz Wi-Fi analysis.',
    description: 'Designed specifically to snap into the Flipper Zero’s top GPIO header. Powered by the ESP32-S2 chipset, it enables in-system debugging via Black Magic Probe over USB-C, wireless over-the-air firmware upgrades, and 2.4GHz Wi-Fi penetration testing workflows with Marauder support.',
    specs: {
      cpu: 'Espressif ESP32-S2FN4R2 (32-bit LX7 single-core @ 240 MHz)',
      ram: '2MB Embedded PSRAM + 4MB Flash',
      weightKg: 0.024,
      connectivity: ['802.11 b/g/n 2.4GHz Wi-Fi', 'USB Type-C (Native JTAG & CDC)', '18-pin Gold Plated Header']
    },
    benchmarks: {
      overallScore: 96
    },
    priceHistory: [
      { date: 'Oct 10', price: 45 },
      { date: 'Nov 01', price: 39 }
    ],
    expertVerdict: {
      verdict: 'The ultimate wireless companion for Flipper Zero. Flashing Marauder unlocks instant 2.4GHz packet inspection and deauth analysis.',
      pros: [
        'Direct GPIO plug-and-play fitment with zero soldering required',
        'Onboard USB-C port provides instant PC debugging interface',
        'Supports Black Magic Probe and open-source Marauder firmwares'
      ],
      cons: [
        'Operates on 2.4GHz spectrum only (no 5GHz or 6GHz band)'
      ],
      bestFor: 'Wireless security researchers, ethical hackers, and ESP32 developers.'
    },
    reviews: [
      {
        id: 'rev-flip-wifi-1',
        productId: 'flipper-zero-wifi-devboard',
        author: 'Nico Ramos',
        role: 'Network Defense Engineer',
        rating: 5,
        title: 'Flawless Marauder integration in seconds',
        comment: 'Flashed Marauder via the web flasher in 60 seconds. Allows beacon sniffing, PMKID capture, and packet auditing with real-time feedback on Flipper’s screen.',
        verifiedBuyer: true,
        testRig: 'Tested with: Flipper Zero Firmware v0.98.3',
        helpfulCount: 42,
        date: '2026-11-05'
      }
    ]
  }
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1.0, format: '$', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', rate: 0.92, format: '€', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', rate: 0.78, format: '£', flag: '🇬🇧' },
  { code: 'JPY', symbol: '¥', rate: 153.5, format: '¥', flag: '🇯🇵' },
  { code: 'CAD', symbol: 'C$', rate: 1.38, format: 'C$', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', rate: 1.54, format: 'A$', flag: '🇦🇺' }
] as const;

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' }
] as const;
