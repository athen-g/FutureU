# FutureU — MHT-CET CAP College Preference List Builder

FutureU is a modern, privacy-first, data-driven web application designed to help engineering aspirants in Maharashtra navigate the Centralized Admission Process (CAP) conducted by the State CET Cell / DTE Maharashtra.

By compiling years of official cutoff database tables into an intelligent, on-device prediction model, FutureU empowers students to draft their option forms with complete confidence.

---

## 💎 Unique Selling Propositions (USPs) & Core Pillars

Unlike standard commercial consulting portals or simple static PDF guides, FutureU stands out through three core pillars:

### 1. 🛡️ 100% Privacy Guarantee (Zero Tracking)
*   **No Databases or Servers**: We do not store or collect student ranks, scores, or names. Everything is processed and cached strictly inside your browser's session storage.
*   **No Registration or Spam Calls**: You do not need to sign up, enter a phone number, or log in. You will **never** receive telemarketing, consulting pitches, or spam calls from private colleges or coaching institutes.

### 2. 📊 Dynamic Rank-Based Prediction Engine
*   **merit Rank Projection**: Cutoff percentiles fluctuate year-to-year based on candidate counts. FutureU automatically projects your 2026 State Merit Rank using candidate inflation rates (from 10% to 40% growth parameters).
*   **Lenient Top Percentile Matching**: Sigmoid power curves scale matching exponents dynamically ($k = 7$ for cutoffs $< 1,000$) to keep highly volatile top percentiles realistic and slightly lenient.
*   **Prioritized Category Cutoffs**: Automatically detects and matches specific reservation codes (OBC, EWS, TFWS, PWD, SC, ST) over general OPEN parameters to show your actual admission odds.

### 3. ⚡ Ultra-Fast Performance (PageSpeed Optimized)
*   **Route-Level Code Splitting**: Lazy loads all routes via `React.lazy()` + `<Suspense>`, lowering initial entrypoint bundle weight by **76.5%** (~204KB).
*   **Progressive Data Loading**: Fetches the active year (`2025-26`) data instantly for initial search operations, while streaming in historical cutoff years (`2024`, `2023`, `2022`) silently in background idle frames.
*   **SSG Pre-rendering**: Over 368 college directory nodes are statically pre-rendered to display rich Open Graph link previews and titles on WhatsApp, Telegram, and Google Search.

---

## 🌟 Core Features

*   **Eligibility Classifications**: Color-coded probability ratings:
    *   🟢 **Safe (75% – 99% chance)**: Percentile is 1.3+ above the predicted cutoff.
    *   🟡 **Moderate (50% – 74% chance)**: Percentile is 0 to 1.3 above the predicted cutoff.
    *   🟠 **Reach (15% – 49% chance)**: Percentile is 0 to 2.0 below the predicted cutoff.
    *   🔴 **Unlikely (1% – 14% chance)**: Percentile is more than 2.0 below the predicted cutoff.
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