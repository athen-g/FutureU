# FutureU — MHT-CET CAP College Preference List Builder

FutureU is a modern, privacy-first, data-driven web application designed to help engineering aspirants in Maharashtra navigate the Centralized Admission Process (CAP) conducted by the State CET Cell / DTE Maharashtra.

By compiling years of official cutoff database tables into an intelligent, on-device prediction model, FutureU empowers students to draft their option forms with complete confidence.

---

## 💎 Unique Selling Propositions (USPs) & Core Pillars

Unlike standard commercial consulting portals or simple static PDF guides, FutureU stands out through three core pillars:

### 1. 🛡️ 100% Privacy Guarantee (Zero Tracking & No Spam)
*   **Completely Client-Side**: All prediction calculations, preference list operations, and historical analysis are performed strictly inside your browser. We have no backend databases or telemetry tracking.
*   **No Registration Required**: You don't need to sign up, input an email address, or enter a phone number.
*   **Zero Spam Calls**: Commercial consulting agencies often sell student data to private colleges, leading to non-stop telemarketing and admission spam. On FutureU, your data is 100% yours and never leaves your machine.

### 2. 📊 Intelligent Rank-Based Prediction Engine
*   **State Merit Rank Projection**: MHT-CET cutoff percentiles shift dramatically depending on yearly candidate volumes. FutureU projects your 2026 State Merit Rank using candidate inflation rates (customizable parameters, with a 22.38% default projection based on the 422,863 candidate pool from 2025-26).
*   **Sigmoid Power Curve Probability**: Admission odds are computed using a mathematical sigmoid curve:
    $$P(r, c) = \frac{100}{1 + \left(\frac{r}{c}\right)^k}$$
    Where $r$ is the student's rank, $c$ is the predicted cutoff, and $k$ is the dynamic scale exponent.
*   **Lenient Top Percentile Sensitivity**: Admission chances are highly non-linear at the top. To remain realistic, the prediction curve scales the exponent $k$ based on competitive density:
    *   $k = 7$ for cutoffs $< 1,000$ (lower exponent = gentler, more lenient cutoff sensitivity at top-tier schools)
    *   $k = 8.5$ for cutoffs $< 5,000$
    *   $k = 10$ otherwise
*   **Prioritized Reservation Cutoffs**: FutureU automatically maps, detects, and prioritizes specific reservation codes (OBC, EWS, TFWS, SC, ST, PWD) over general Open category parameters to give you the most accurate real-world probabilities.
*   **Exponential Recency Weighting**: Predicted cutoffs are calculated by weighting recent years higher ($w_t = \lambda^{(t - \text{base})}$) combined with a 40% trend projection factor to match rising or falling branch demand.

### 3. ⚡ High-Speed Performance & Accessibility
*   **Route-Level Code Splitting**: Employs React lazy loading (`React.lazy` + `<Suspense>`) to slash the initial entrypoint JS bundle payload by **76.5%** (from 870KB down to ~204KB).
*   **Progressive Data Loading**: The application loads the active year's core dataset (`2025-26`) instantly for search readiness, while streaming in the remaining historical tables (`2024`, `2023`, `2022`) in background idle frames to prevent main-thread blockage.
*   **WCAG AA Compliance**: Fully optimized contrast variables (including primary red and muted text shades) designed to pass strict WCAG AA standards.
*   **Zero External Blocking Scripts**: Completely removed bloated third-party scripts (like overlay widgets) to ensure a blistering PageSpeed performance score on mobile devices.

---

## 🌟 Core Features

*   **Eligibility Classifications**: Color-coded probability ratings:
    *   🟢 **Safe (75% – 99% chance)**: Student rank/percentile is 1.3+ above the predicted cutoff.
    *   🟡 **Moderate (50% – 74% chance)**: Student rank/percentile is 0 to 1.3 above the predicted cutoff.
    *   🟠 **Reach (15% – 49% chance)**: Student rank/percentile is 0 to 2.0 below the predicted cutoff.
    *   🔴 **Unlikely (1% – 14% chance)**: Student rank/percentile is more than 2.0 below the predicted cutoff.
*   **Seat Matrix Breakdown**: Visual mapping of seat types (General, Ladies, PWD, Defense, etc.) per branch.
*   **Preference Builder & PDF Exporter**: Shortlist college-branch combinations to print a clean preference list for the official CET portal.

---

## 🛠️ Technology Stack

*   **Frontend Core**: React 18 + Vite + React Router DOM v6
*   **Charts**: Chart.js & React-Chartjs-2
*   **PDF Generation**: jsPDF
*   **Icons**: Lucide React
*   **Design System**: Variable-driven Vanilla CSS with fully responsive dark/light modes.

---

## 📊 Data Coverage & Verification

Our database contains parsed data directly from official Maharashtra CET Cell publications:
*   **2022-23**: CAP Round 1, 2, 3 MH & AI cutoffs + Seat Matrix data
*   **2023-24**: CAP Round 1, 2, 3 MH & AI cutoffs + Seat Matrix data
*   **2024-25**: CAP Round 1, 2, 3 MH & AI cutoffs + Seat Matrix data
*   **2025-26**: CAP Round 1, 2, 3, 4 MH & AI cutoffs + Seat Matrix data

*Disclaimer: FutureU is an advisory tool. Always cross-verify details with the official [MHT-CET Admission Portal](https://cetcell.mahacet.org) before locking options.*

---

## 🚀 Getting Started

To run the project locally:

1. **Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
2. **Start Dev Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. **Build & Pre-render for Production**
   ```bash
   npm run build
   ```