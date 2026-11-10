# Vector Pacific // Raspberry Pi, Flipper Zero, & Google Workspace Expansion Plan

Comprehensive implementation roadmap for integrating official **Raspberry Pi** single-board computers and **Flipper Zero** hardware penetration testing tools into Vector Pacific's hardware manifest, with dedicated category filtering, benchmark ratings, spec comparisons, and Google Workspace (Drive, Gmail, and Keep-compatible notes) synchronization.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Product Expansion & Category Architecture**:
> - **Raspberry Pi 5 Line**: Features the **Raspberry Pi 5 (8GB) Official Flagship Kit** (BCM2712 Quad-core ARM Cortex-A76 @ 2.4 GHz, PCIe 2.0 NVMe, Active Cooler) and the **Raspberry Pi 5 AI Kit** (13 TOPS Hailo-8L neural processing accelerator module + M.2 HAT+).
> - **Flipper Zero Line**: Features the **Flipper Zero Multi-Tool & Cyber Companion** (Sub-1 GHz RF 300-928 MHz, 125 kHz RFID, 13.56 MHz NFC, Infrared, GPIO, sunlight-readable orange LCD) and the official **Flipper Zero Wi-Fi Developer Board v1** (ESP32-S2 for Marauder, packet analysis, and in-system debugging).
> - **Category Filtering**: Added dedicated **SBC / Microcomputers** (`sbc`) and **Hardware Security** (`cybersec`) filters to the catalog navigation alongside laptops, keyboards, and mice.

- **Confirmed Decision 1 (Enthusiast Visual Assets)**: High-resolution studio product photography generated and embedded for both Raspberry Pi 5, Pi AI Kit, Flipper Zero, and Wi-Fi Dev Board.
- **Confirmed Decision 2 (Benchmark Lab Integration)**: Raspberry Pi 5 single-board benchmarks (Geekbench 6 single 795, multi 1740) and Flipper Zero overall capability rating (99/100) integrated into the live comparison matrix.
- **Confirmed Decision 3 (Google Workspace Sync)**: 1-click export of Raspberry Pi & Flipper Zero build manifests directly to Google Drive, email dispatch of invoices/specs via Gmail, and Keep-compatible scratchpad notes.

---

## 1. Overview & Core Concept

- **What It Does**:
  - Expands Vector Pacific’s curated hardware ecosystem into single-board computing (SBC) and hardware security tools.
  - Users can browse, compare, and filter Raspberry Pi 5 and Flipper Zero products with granular hardware specs (chipset silicon, radio frequencies, PCIe expansion, TOPS compute, GPIO tolerances).
  - Add to Manifest / Cart with real-time stock tracking across regional warehouses.
  - Back up hardware configurations and part manifests directly to **Google Drive** or dispatch spec dossiers via **Gmail**.
  - Capture overclocking profiles, Marauder firmware notes, and GPIO pinouts in the **Keep-Style Hardware Scratchpad**.
- **Target Audience / Persona**: Hardware hackers, edge AI developers, penetration testers, embedded robotics engineers, and home-lab builders.
- **Key Value**: Unifies cutting-edge laptops, performance input peripherals, microcomputers, and security multi-tools in one high-performance West Coast catalog with cloud synchronization.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Category Navigation & Filtering**:
   - In the hardware manifest section, tabs include: *All*, *Laptops*, *Keyboards*, *Mice*, *Monitors*, *Audio*, *Accessories*, *SBC / Pi*, and *Cybersec*.
   - Selecting *SBC / Pi* filters down to the Raspberry Pi 5 8GB Flagship Kit and Pi 5 13 TOPS AI Kit.
   - Selecting *Cybersec* surfaces the Flipper Zero Multi-Tool and Wi-Fi Developer Board.
2. **Product Detail & Protocol Specs**:
   - Deep-dive specification view showing exact silicon details (Broadcom BCM2712, STM32WB55, ESP32-S2, Hailo-8L NPU).
   - Radio frequency bands (Sub-GHz 300-928 MHz, 13.56 MHz NFC, 125 kHz RFID) and power dissipation metrics.
   - Verified buyer reviews from robotics lab directors and penetration testers.
3. **Hardware Comparison & Benchmark Matrix**:
   - Side-by-side spec differential comparing Raspberry Pi 5 vs Pi AI Kit, or Flipper Zero vs Devboard.
   - Export comparison dossier directly to Google Drive in formatted Markdown.
4. **Workspace Cloud Sync**:
   - 1-click backup of Raspberry Pi / Flipper Zero orders to Google Drive (`Vector_Pacific_Cart_Manifest.json`).
   - Email purchase confirmation or lab reports via Gmail to `tyevs399@gmail.com` with mandatory confirmation dialog.
   - Dedicated Keep scratchpad notes for Flipper Zero sub-GHz frequencies and Raspberry Pi Docker configs.

### Visual Identity & Theme
- Obsidian and carbon fiber backdrop (`#0b0f17`) with warm Amber (`#f59e0b`), Cyber Orange (`#f97316`), and Pacific Cyan accents.
- High-contrast spec pills and crisp JetBrains Mono typography for protocol and voltage labels.

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Solution | Rationale & Alternative Considered |
| :--- | :--- | :--- |
| **New Catalog Categories** | Dedicated `sbc` and `cybersec` category tags | Lumping Raspberry Pi and Flipper Zero under generic "accessories" buries flagship hacker hardware. Dedicated tags provide fast discovery. |
| **Silicon & Spec Modeling** | Granular protocol fields (Sub-GHz, RFID, NFC, TOPS) | Hardware enthusiasts care about exact radio frequencies, GPIO tolerances, and NPU inference rates, not just generic CPU/RAM numbers. |
| **Google Drive Manifest Backup** | Full JSON & Markdown structured exports | Developers and sysadmins want clean, machine-readable manifests they can version-control in their Google Drive storage. |
| **Keep Notes Synchronization** | Drive-backed persistent notes + Gmail dispatch | Bypasses enterprise-only Google Keep API restriction while preserving the exact Keep sticky note and checklist workflow. |

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        VECTOR PACIFIC PLATFORM                         │
│                                                                        │
│  ┌─────────────────────── Catalog & Manifest ───────────────────────┐  │
│  │                                                                  │  │
│  │   • Laptops (Razer Blade 18)   • Monitors (ASUS ROG Swift OLED)  │  │
│  │   • Keyboards (Wooting 80HE)   • SBC / Pi (Raspberry Pi 5 + AI)  │  │
│  │   • Mice (Razer Viper Pro)     • Cybersec (Flipper Zero + WiFi)  │  │
│  │                                                                  │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│         ┌───────────────────────────┼───────────────────────────┐      │
│         ▼                           ▼                           ▼      │
│  ┌──────────────┐            ┌──────────────┐            ┌──────────┐  │
│  │ Spec Matrix  │            │  Benchmark   │            │  Cart &  │  │
│  │  Comparison  │            │  Simulation  │            │ Checkout │  │
│  └──────┬───────┘            └──────┬───────┘            └───┬──────┘  │
│         │                           │                        │         │
│         └───────────────────────────┼────────────────────────┘         │
│                                     ▼                                  │
│                    ┌─────────────────────────────────┐                 │
│                    │   Google Workspace Hub Modal    │                 │
│                    │   - Google Drive File Explorer  │                 │
│                    │   - Gmail RFC 2822 Dispatch     │                 │
│                    │   - Hardware Keep Scratchpad    │                 │
│                    └────────────────┬────────────────┘                 │
│                                     │                                  │
│         ┌───────────────────────────┼───────────────────────────┐      │
│         ▼                           ▼                           ▼      │
│  ┌──────────────┐            ┌──────────────┐            ┌──────────┐  │
│  │ Google Auth  │            │ Google Drive │            │  Gmail   │  │
│  │  (Firebase)  │            │   REST v3    │            │ REST v1  │  │
│  └──────────────┘            └──────────────┘            └──────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Component & State Mapping

1. **`src/types/index.ts`**:
   - `ProductCategory`: includes `'sbc'` and `'cybersec'`.
2. **`src/data/products.ts`**:
   - Contains `raspberry-pi-5-8gb`, `raspberry-pi-ai-kit`, `flipper-zero-multitool`, and `flipper-zero-wifi-devboard` with full specs, price histories, and expert verdicts.
3. **`src/components/catalog/ProductGrid.tsx`**:
   - Category navigation pills for SBC / Microcomputers and Hardware Security.
4. **`src/components/workspace/WorkspaceModal.tsx`**:
   - Google Drive explorer, Gmail dispatch center, and Keep-compatible hardware notes.
5. **`src/App.tsx`**:
   - Mounts `WorkspaceModal` to provide unified cloud sync across all views.

---

## 5. Verification Plan

1. **Compilation & Linting**:
   - Run `compile_applet` and `lint_applet` together to verify 0 errors.
2. **Product Catalog Verification**:
   - Verify Raspberry Pi and Flipper Zero products render with their generated studio imagery, specs, pricing, and stock status.
   - Verify filtering by `sbc` and `cybersec` displays the correct products.
3. **Google Workspace Hub Verification**:
   - Verify Google Sign-In with in-memory token management.
   - Verify Google Drive upload for Raspberry Pi & Flipper Zero cart manifests.
   - Verify Gmail email dispatch with explicit confirmation modal.
   - Verify Keep-style builder scratchpad notes with Drive sync.
