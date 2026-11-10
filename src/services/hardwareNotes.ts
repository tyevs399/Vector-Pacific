/**
 * Hardware Enthusiast Notes & Rig Scratchpad Service
 * Syncs seamlessly with Google Drive and dispatches via Gmail
 */

export interface HardwareNote {
  id: string;
  title: string;
  content: string;
  color: 'amber' | 'blue' | 'purple' | 'emerald' | 'slate';
  pinned: boolean;
  checklist?: Array<{ id: string; text: string; done: boolean }>;
  tags: string[];
  updatedAt: string;
}

const STORAGE_KEY = 'vector_pacific_hardware_notes_v1';

export const INITIAL_NOTES: HardwareNote[] = [
  {
    id: 'note-oc-blade18',
    title: 'Razer Blade 18 // Undervolt & OC Profile',
    content: 'Core voltage offset: -65mV cache, -50mV core. Target boost frequency: 5.6 GHz on P-cores. Fan profile pinned at 4800 RPM during 3DMark Time Spy runs. Temps capped at 82°C with liquid metal repaste.',
    color: 'amber',
    pinned: true,
    tags: ['Overclock', 'Thermals', 'Razer Blade 18'],
    checklist: [
      { id: 'c1', text: 'Apply -65mV offset in BIOS / XTU', done: true },
      { id: 'c2', text: 'Run Cinebench R24 30-min throttle loop', done: true },
      { id: 'c3', text: 'Verify memory timings @ DDR5-5600 CL38', done: false }
    ],
    updatedAt: '2026-11-10 12:30 PST'
  },
  {
    id: 'note-desk-bom',
    title: 'Dual Rig Sourcing & Peripheral Manifest',
    content: 'Key parts for the Pacific workstation build. Primary display: ASUS ROG Swift PG32UCDM 4K OLED 240Hz. Primary input: Wooting 80HE with Lekker L60 switches tuned to 0.1mm actuation.',
    color: 'blue',
    pinned: true,
    tags: ['Dream Rig', 'Peripherals', 'Sourcing'],
    checklist: [
      { id: 'c4', text: 'Order Wooting 80HE Zinc Alloy case', done: true },
      { id: 'c5', text: 'Source 2x 2m braided DP 2.1 UHBR20 cables', done: true },
      { id: 'c6', text: 'Calibrate OLED HDR with Datacolor SpyderX2', done: false }
    ],
    updatedAt: '2026-11-09 18:15 PST'
  },
  {
    id: 'note-bench-targets',
    title: 'Benchmark Target Milestone Database',
    content: 'Cinebench R24 Multi-Core target: > 2,150 pts. Geekbench 6 Single-Core target: > 3,200 pts. Time Spy Extreme Graphics target: > 14,000 pts with RTX 5090 Mobile @ 175W TGP.',
    color: 'purple',
    pinned: false,
    tags: ['Benchmarking', 'Target Scores'],
    updatedAt: '2026-11-08 14:00 PST'
  }
];

export const loadHardwareNotes = (): HardwareNote[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_NOTES;
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTES;
  }
};

export const saveHardwareNotes = (notes: HardwareNote[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.warn('Failed to save notes to localStorage:', err);
  }
};
