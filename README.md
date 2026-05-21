# 2026-ResoScan

Next.js clinical console for ResoScan.

## Live

➡️ **https://web-bice-phi-71.vercel.app**

## What you can do

- **`/`** — landing page (hero, problem, how it works, team)
- **`/dashboard/scan`** — the interactive clinical workstation
  - Body silhouette with the selected tibia breathing in cyan
  - Animated PSD with healthy-bone reference overlay + f₀ peak marker
  - Live sliders for **callus stiffness · contact pressure · weeks since fracture · loose-hardware toggle** — every change instantly re-runs the scan, AI verdict, projection, and clinical summary
  - 16-week healing-timeline chart with phase shading (Inflammatory / Soft callus / Hard callus / Remodeling) and the 80% safe-to-walk threshold
  - Spectrogram (frequency × time)
  - Full clinical-metrics grid: **TSI · RUST with 4-cortex breakdown · resonant frequency · damping ratio ζ · Q-factor · half-power bandwidth**
  - AI explainability: classification, "% sure", trust badge ("96% accuracy on 4 000 cases"), expandable *Other possible outcomes the AI considered* + *Why this assessment?*
- **`/dashboard/patients`** — three patient case studies (Arjun cleared / Priya delayed / Vikram non-union risk) with personalised Gompertz healing trajectories and days-to-walk prediction
- **`/dashboard/model`** — how accurate is the AI? In plain English. 95% accuracy, 25 measurements per scan, explainable AI.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **Tailwind CSS v4** (CSS-first config)
- **TypeScript** · **Framer Motion** · **Recharts** · **Lucide React**
- **No backend, no database, no auth.** All scan physics, ML predictions, and patient trajectories computed client-side in TypeScript — closed-form Lorentzian PSD and Gompertz prediction. Production-faithful to the Python reference.

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`. The dashboard auto-runs a scan on first paint.

## Deploy

```bash
npx vercel --prod
```

## Verify TypeScript port

```bash
npx tsx scripts/verify-prediction.ts
```

Runs the Gompertz prediction for all three demo patients and prints expected verdicts (Arjun cleared, Priya days-to-walk, Vikram non-union risk). Used to confirm parity with the Python reference (`ortho_simulator/engine/healing_prediction.py` in the companion repo).

## Project layout

```
resoscan/
├── app/
│   ├── page.tsx                 landing
│   ├── layout.tsx               fonts + theme
│   ├── globals.css              brand tokens
│   └── dashboard/
│       ├── layout.tsx           rail + topbar shell
│       ├── scan/page.tsx        live scan workstation
│       ├── patients/page.tsx    3 patient case studies
│       └── model/page.tsx       model trust page
├── components/
│   ├── ui/                      shadcn primitives
│   ├── landing/                 hero, problem, how-it-works, team, footer
│   ├── dashboard/
│   │   ├── scan/                silhouette, resonance graph, waveform,
│   │   │                        spectrogram, healing timeline,
│   │   │                        clinical metrics, AI assessment, sliders
│   │   └── patients/            trajectory chart, patient cards, detail
│   └── brand/                   wordmark, resonance-wave background
├── lib/
│   ├── patients.ts              3 demo patients + dense scan histories
│   ├── prediction.ts            closed-form Gompertz days-to-walk
│   ├── scan.ts                  Lorentzian PSD + waveform + spectrogram + metrics
│   ├── summary.ts               auto-generated clinical narrative
│   └── model-metrics.json       AI CV / holdout / external-validation numbers
├── public/
│   └── artifacts/               ML validation PNGs (confusion matrix, ROC, …)
└── scripts/
    └── verify-prediction.ts     CLI parity check vs Python
```

## Team

Built at **Ramaiah Institute of Technology** by:

- Yashas N — Software & AI
- Jeeth Kataria — Hardware & DSP
- Naveen Gopalakrishna Patil — ML Engineering

**Project guide:** Dr. Sowmya B. J., Associate Professor, Dept. of AI & Data Science.

## Companion repos

- **Hardware firmware + ML pipeline + Streamlit simulator:** https://github.com/Yashasnagraj/UNISYS

## Handoff notes

- This repo is the clean transfer target: only the ResoScan console source was copied in.
- No files from the older local `ResoScan_Software` tree were pushed here.
- The repository name is now aligned to the target remote: `UnisysUIP/2026-ResoScan`.

## Licence

Patent pending. All rights reserved during the UNISYS 2026 finals window.
