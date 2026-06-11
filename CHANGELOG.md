# Changelog

All notable changes to **FutureU** will be documented in this file.

---

## [v2.2.0] - 2026-06-11
### Added
- **Silent Background Loading**: Homepage and College Directory pages render instantly. Data is downloaded and compiled silently in the background via `loadAppData()` updates.
- **Search Shimmer Skeletons**: Integrated custom table row skeletons on Homepage recommendations during search calculations (features simulated 1.2s premium delay for feedback).
- **Directory Card Skeletons**: Integrated a grid of 6 shimmering directory card skeletons on CollegesPage while loading data.
- **Fade & Stagger Animations**: Staggered fadeInUp reveal transitions (0.05s increments) on loaded search recommendation rows for a premium, calculated look.
- **Aesthetic Developer Social Links**: Re-aligned Developer Profile action buttons side-by-side, adding LinkedIn and Personal Portfolio links with brand-specific hover states.

---

## [v2.1.0] - 2026-06-11
### Added
- **Asynchronous Data Chunking**: Refactored the data loader to use dynamic `import()` statements for cutoff and seat matrix JSON files.
- **Optimized Initial Bundle Size**: Decoupled 30MB+ of raw JSON data from the main entrypoint JavaScript bundle, creating lazy-loaded chunks under `dist/assets/` and reducing First Contentful Paint (FCP) from 27 seconds to under 0.5 seconds.
- **Loading State Screens**: Added minimalist loading spinner screens on data-dependent detail routes and context providers.

---

## [v2.0.0] - 2026-06-11
### Changed
- **Rank-Based Prediction Engine**: Migrated the admission prediction matching model from percentiles to ranks. Cutoffs are predicted using weighted historical averages combined with regression rank trends:
  $$\text{Cutoff} = \text{Weighted Avg} + \text{Average Trend} \times 0.4$$
- **Admission Probability Math**: Overhauled calculations (`calculateChance`) to process percentile/rank ratio sigmoid power curves:
  $$\text{Chance (\%)} = \frac{100}{1 + \left(\frac{\text{Student Rank}}{\text{Predicted Cutoff Rank}}\right)^{10}}$$
- **Candidate Inflation Calculator Widget**: Added a collapsible calculator widget on the Homepage allowing students to convert ranks on-the-fly, estimate rank placeholders, and customize the appeared candidate inflation rate parameter (10% to 40%).
- **Dual Display Format**: Renders ranks side-by-side with percentiles in recommendations list, branch list table, expanded popups, and the generated PDF report.
- **PDF Exporter Upgrades**: Updated `exportPdf.js` to process rank-based ordering, custom page heights, and dual cutoff columns.

---

## [v1.2.0] - 2026-06-11
### Added
- **Dynamic SEO Metadata Hook**: Implemented custom hook `useMeta` to dynamically update document title and meta descriptions on detail pages for Google Search crawlers.
- **Automated Sitemap Generator**: Added a postbuild Node script (`scripts/generate-sitemap.cjs`) parsing seat matrices to output a complete `public/sitemap.xml` with 368 colleges.
### Fixed
- **Cleaned DataLoader Code Maps**: Standardized and unified duplicate or truncated branch names inside the mapping tables.
- **COEP Code Merging**: Added code migration rules (e.g. mapping 06006 / 6006 -> 16006) to prevent data duplication.
- **Cleaned CSS layouts**: Removed redundant and empty CSS selectors from stylesheet.

---

## [v1.1.0] - 2026-06-10
### Added
- **2025-26 Datasets**: Added official CAP Round 1, 2, 3, 4 cutoff datasets and seat matrices.
- **CAP Round 4 Support**: Integrated Round 4 parameters into the database model.
### Changed
- **Eligibility Exclusions**: Excluded branches without predicted cutoffs and restricted recommendations below a 5% buffer from the student's percentile.

---

## [v1.0.1] - 2026-06-09
### Added
- **Support Modal Popup**: Created a support popup widget for FutureU users.
- **GPay UPI Integration**: Added direct mobile support with GPay QR code display and one-click UPI copy helper.

---

## [v1.0.0] - 2026-06-08
### Added
- **CAP Preference Builder**: Initial release enabling MHT-CET preferences list drafting.
- **Filtering & Routing**: Integrated React Router navigation, CAP round filters, dark/light theme switching, and Vercel Analytics.
