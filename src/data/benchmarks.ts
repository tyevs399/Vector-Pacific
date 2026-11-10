export interface IndustryBenchmarkBaseline {
  id: string;
  name: string;
  category: 'desktop_flagship' | 'laptop_average' | 'previous_gen' | 'ultrabook' | 'workstation';
  description: string;
  hardwareSummary: string;
  scores: {
    geekbenchSingle: number;
    geekbenchMulti: number;
    cinebench2024Single: number;
    cinebench2024Multi: number;
    timeSpyGraphics: number;
    latencyMs: number;
    acousticNoiseDba: number;
    thermalThrottlingPercent: number; // % performance lost after 60 min loop
    overallRating: number;
  };
  radarAxes: {
    singleCore: number; // 0 - 100 scale
    multiCore: number;
    graphicsRaster: number;
    thermalHeadroom: number;
    acousticSilence: number;
    inputResponsiveness: number;
  };
}

export const INDUSTRY_BENCHMARK_BASELINES: IndustryBenchmarkBaseline[] = [
  {
    id: 'desktop-flagship-2026',
    name: 'Pro Desktop Reference (2026)',
    category: 'desktop_flagship',
    description: 'Unhindered 450W desktop architecture with full-tower custom liquid cooling and zero power limitations.',
    hardwareSummary: 'Intel Core i9-14900KS · RTX 4090 24GB (450W) · 64GB DDR5-7200 · 360mm AIO',
    scores: {
      geekbenchSingle: 3250,
      geekbenchMulti: 23800,
      cinebench2024Single: 142,
      cinebench2024Multi: 2450,
      timeSpyGraphics: 36500,
      latencyMs: 1.2,
      acousticNoiseDba: 44.0,
      thermalThrottlingPercent: 0,
      overallRating: 99
    },
    radarAxes: {
      singleCore: 96,
      multiCore: 98,
      graphicsRaster: 100,
      thermalHeadroom: 95,
      acousticSilence: 70,
      inputResponsiveness: 92
    }
  },
  {
    id: 'laptop-mainstream-gaming',
    name: 'Industry Average Gaming Laptop (115W TGP)',
    category: 'laptop_average',
    description: 'The standard mid-tier mobile gaming laptop sold across global retail channels.',
    hardwareSummary: 'Intel Core i7-14700HX · RTX 4070 Laptop (115W) · 16GB DDR5-5200 · Dual Heatpipe',
    scores: {
      geekbenchSingle: 2650,
      geekbenchMulti: 14200,
      cinebench2024Single: 112,
      cinebench2024Multi: 1280,
      timeSpyGraphics: 12800,
      latencyMs: 4.8,
      acousticNoiseDba: 51.5,
      thermalThrottlingPercent: 12.5,
      overallRating: 72
    },
    radarAxes: {
      singleCore: 75,
      multiCore: 68,
      graphicsRaster: 58,
      thermalHeadroom: 55,
      acousticSilence: 50,
      inputResponsiveness: 72
    }
  },
  {
    id: 'previous-gen-flagship-2023',
    name: 'Previous-Gen Flagship Laptop (2022-2023)',
    category: 'previous_gen',
    description: 'Previous-generation top-tier 150W gaming laptop standard for upgrade comparisons.',
    hardwareSummary: 'Intel Core i9-12900H · RTX 3080 Ti Laptop (150W) · 32GB DDR5-4800',
    scores: {
      geekbenchSingle: 2380,
      geekbenchMulti: 13100,
      cinebench2024Single: 102,
      cinebench2024Multi: 1090,
      timeSpyGraphics: 13900,
      latencyMs: 5.6,
      acousticNoiseDba: 53.0,
      thermalThrottlingPercent: 15.0,
      overallRating: 68
    },
    radarAxes: {
      singleCore: 68,
      multiCore: 62,
      graphicsRaster: 62,
      thermalHeadroom: 48,
      acousticSilence: 45,
      inputResponsiveness: 66
    }
  },
  {
    id: 'creator-workstation-apple',
    name: 'Pro Mobile Workstation Standard (Apple Silicon)',
    category: 'workstation',
    description: 'High-efficiency ARM-based unified architecture optimized for video pipelines and whisper-quiet thermals.',
    hardwareSummary: 'Apple M4 Pro 14-Core CPU · 20-Core GPU · 48GB Unified Memory (273GB/s)',
    scores: {
      geekbenchSingle: 3880,
      geekbenchMulti: 21500,
      cinebench2024Single: 172,
      cinebench2024Multi: 1740,
      timeSpyGraphics: 15200, // Normalized Metal compute equivalent
      latencyMs: 3.5,
      acousticNoiseDba: 29.0,
      thermalThrottlingPercent: 2.0,
      overallRating: 92
    },
    radarAxes: {
      singleCore: 100,
      multiCore: 92,
      graphicsRaster: 68,
      thermalHeadroom: 94,
      acousticSilence: 98,
      inputResponsiveness: 85
    }
  },
  {
    id: 'ultrabook-thin-light',
    name: 'Ultrabook & Thin-and-Light Standard (28W)',
    category: 'ultrabook',
    description: 'Modern ultraportable everyday productivity standard with integrated NPU and low thermal ceiling.',
    hardwareSummary: 'Intel Core Ultra 7 155H · Intel Arc Integrated Graphics · 16GB LPDDR5X (28W)',
    scores: {
      geekbenchSingle: 2350,
      geekbenchMulti: 12400,
      cinebench2024Single: 98,
      cinebench2024Multi: 890,
      timeSpyGraphics: 3600,
      latencyMs: 8.2,
      acousticNoiseDba: 37.0,
      thermalThrottlingPercent: 18.0,
      overallRating: 54
    },
    radarAxes: {
      singleCore: 65,
      multiCore: 56,
      graphicsRaster: 22,
      thermalHeadroom: 42,
      acousticSilence: 82,
      inputResponsiveness: 60
    }
  }
];

export interface SimulatedWorkload {
  id: string;
  name: string;
  metricLabel: string;
  targetUnit: string;
  baseLoadSeconds: number; // Base seconds on reference system
  stressIntensity: number; // 1 to 10 scale
  category: 'compute' | 'gaming' | 'ai' | 'esports';
  description: string;
}

export const SIMULATED_WORKLOADS: SimulatedWorkload[] = [
  {
    id: 'unreal-8k-render',
    name: '8K Unreal Engine 5.4 Lumen Render',
    metricLabel: 'Render Completion Time',
    targetUnit: 'seconds (lower is faster)',
    baseLoadSeconds: 240,
    stressIntensity: 9.5,
    category: 'compute',
    description: 'Heavy multi-threaded Nanite mesh clustering, ray-traced ambient occlusion, and VRAM bandwidth saturation.'
  },
  {
    id: 'cyberpunk-pathtracing-4k',
    name: 'Cyberpunk 2077 Full Path Tracing (4K DLSS Quality)',
    metricLabel: 'Sustained Framerate',
    targetUnit: 'FPS (higher is smoother)',
    baseLoadSeconds: 78,
    stressIntensity: 9.8,
    category: 'gaming',
    description: 'Full path-traced bounces, BVH traversal, and 175W maximum graphics TGP stress test.'
  },
  {
    id: 'llm-inference-70b',
    name: 'Llama-3 70B Local LLM Inference (Q4_K_M)',
    metricLabel: 'Token Generation Speed',
    targetUnit: 'tokens/sec (higher is faster)',
    baseLoadSeconds: 24,
    stressIntensity: 8.0,
    category: 'ai',
    description: 'Massive unified memory bandwidth utilization, tensor quantization, and sustained matrix multiplication.'
  },
  {
    id: 'valorant-esports-500fps',
    name: 'Esports Counter-Strafing & Frame Latency',
    metricLabel: 'End-to-End System Click Latency',
    targetUnit: 'ms (lower is faster)',
    baseLoadSeconds: 3.2,
    stressIntensity: 5.5,
    category: 'esports',
    description: '8000Hz polling rate jitter testing, Rapid Trigger reset responsiveness, and sub-frame pacing.'
  }
];
