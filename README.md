# FutureU — MHT-CET CAP College Preference List Builder

FutureU is a modern, data-driven web application designed to help engineering aspirants in Maharashtra navigate the Centralized Admission Process (CAP) conducted by the CET Cell / DTE Maharashtra. By parsing and analyzing official cutoff data, FutureU empowers students to make intelligent, informed decisions when submitting their option forms.

---

## 🌟 How FutureU Helps Students

Selecting the right engineering colleges and branches can be overwhelming. FutureU simplifies this process by providing:

1. **Smart Cutoff Predictions**
   - We utilize a weighted average of historical CAP cutoffs across multiple years (2022-23 to 2024-25) combined with trend projection. More recent years are weighted higher to give a realistic cutoff prediction.

2. **Eligibility and Admission Probability**
   - Students enter their MHT-CET or JEE percentile and receive instant color-coded classifications:
     - 🟢 **Safe (>= 75% chance)**: High likelihood of admission.
     - 🟡 **Moderate (>= 50% chance)**: Good chance, strong option.
     - 🟠 **Reach (>= 15% chance)**: Competitive, but worth keeping in the preference list.
     - 🔴 **Unlikely (< 15% chance)**: Highly competitive, lower probability of admission.

3. **Interactive Trend Analysis**
   - Aspirants can click on any branch to view a detailed trend chart (using Chart.js) showing cutoff percentiles for the last three years, helping them spot rising or falling demand.

4. **Multi-Round and Category Filters**
   - Aspirants can view cutoff details for specific **CAP Rounds (1, 2, or 3)** and **Reservation Categories** (e.g., OPEN, OBC, SC, ST, EWS, TFWS, etc.). This helps identify how cutoffs fluctuate across rounds.

5. **Seat Matrix Breakdown**
   - Provides a comprehensive, color-coded grid mapping out seat types (General, Ladies, PWD, Defense, etc.) per branch, helping students locate colleges with available seats for their specific categories.

6. **Custom Preference List Builder & PDF Export**
   - Students can shortlist college-branch combinations to create a structured preference list.
   - The list can be sorted, reordered, and exported to a clean, print-friendly PDF, ready to refer to when filling the official CET Option Form.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18 + Vite (for high-speed development and bundling) + React Router DOM v6
- **Charts**: Chart.js & React-Chartjs-2
- **PDF Generation**: jsPDF
- **Icons**: Lucide React
- **Design System**: Vanilla CSS with customized variable-driven dark/light mode support, Outfit & Poppins modern typographies, and a responsive mobile-first grid.

---

## 📊 Data Coverage & Verification

Our database contains parsed data directly from official Maharashtra CET Cell publications:
- **2022-23**: CAP Round 1, 2, and 3 MH & AI cutoffs
- **2023-24**: CAP Round 1, 2, and 3 MH & AI cutoffs
- **2024-25**: CAP Round 1, 2, and 3 MH & AI cutoffs + Seat Matrix data

*Disclaimer: FutureU is an advisory tool. Always cross-verify details with the official [MHT-CET Admission Portal](https://cetcell.mahacet.org) before locking options in the CAP portal.*

---

## 🚀 Getting Started

To run the project locally on your machine, follow these steps:

1. **Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
2. **Start Dev Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. **Build for Production**
   ```bash
   npm run build
   ```

*Note: For detailed hosting steps and online deployment instructions, check the [setup-guide.md](setup-guide.md) file.*
