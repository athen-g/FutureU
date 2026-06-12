# Changelog

All notable changes to **FutureU** will be documented in this file.

---

## [v2.5.0] - 2026-06-12
### Added
- **Asynchronous Font Preloading**: Optimized Google Fonts loading in `index.html` to preload font stylesheets and render them asynchronously, resolving swap-related layout shifts.
- **MHT-CET Rank Range Column**: Added a dedicated "MHT-CET Rank Range" column/card next to the "MHT-CET Cutoff Range" card on the College Details page, displaying cutoff ranks for the selected reservation category.
- **Developer Social & Feedback Extensions**: Integrated Instagram profile link with brand icon in a 2x2 grid on the About page, and added a minimalist Google Feedback Form call-to-action button in the "Our Mission" section.

### Changed
- **Cutoff Directory Sorting**: Overhauled College Directory sorting to order colleges by the previous year's (`2025-26`) cutoff percentile of their highest branch under the `GOPENS` category (falling back if missing), correctly sorting top-tier colleges first when sorted High to Low.
- **Dynamic Category Labels**: Configured stats card subtexts on the College Details page to dynamically reflect the selected reservation category name (e.g. `General OBC State Level %ile` / `General OBC State Level Rank`).
- **Comprehensive USP README**: Refactored the repository `README.md` to detail FutureU's Unique Selling Propositions, client-side privacy architecture, logistic sigmoid curves, and dynamic top-percentile leniency scales.
- **Accessibility Color Contrast**: Darkened the primary red color (`#D90000` from `#FF0000`) and the secondary text-muted color in `variables.css` to comply with WCAG AA accessibility standards.
- **Mockup Design Contrast**: Darkened contrast colors of tags and labels in `LandingPage.css` inside the hero mockup card interface.
- **Ko-fi Script Removal**: Deleted the resource-heavy, dynamic Ko-fi chat widget loader script from `SupportModal.jsx`, saving 2.2 seconds of main-thread execution time.
- **Mockup Heading Semantics**: Replaced skipped `<h4>` tags inside the landing page mockup card structure with `<h3>` tags to maintain a structured logical heading tree.

---

## [v2.4.0] - 2026-06-12
### Added
- **Performance & PageSpeed Boost**: Implemented route-level code splitting using `React.lazy` and `React.Suspense` for all pages, slashing the initial entrypoint JavaScript bundle weight by **76.5%** (from 870KB down to 204KB).
- **Progressive Data Loading**: Refactored the data loader to fetch active year data (`2025-26`) instantly, deferring historical years (`2024-25`, `2023-24`, `2022-23`) to load asynchronously in background idle cycles.
- **Dynamic Context Updates**: Integrated a context `dataVersion` tracker to automatically update page-level memos and charts when historical loading completes.
- **Lenient Top Percentile Matching**: Dynamic matching sigmoid exponent adjustment ($k = 7$ for cutoff ranks $< 1,000$, $k = 8.5$ for $< 5,000$, $k=10$ otherwise) to ensure top percentile predictions remain realistic.
- **Rank Scale Callouts**: Added detailed callouts explaining rank scale density and cutoff sensitivity on the Homepage search alerts and How It Works page.

### Changed
- **Cutoff Prioritization**: Upgraded homepage searches to respect and prioritize specific reservation categories (OBC, EWS, TFWS, PWD) over general OPEN cutoffs.
- **Search Sorting Order**: Recommendations list is now ordered by historical cutoff ranks (`previousRank`) from hardest to easiest for better reference.
- **Visual Grid Improvements**: Redesigned the Landing Page features grid to display all items on a single row.
- **Footer Theme Override**: Applied a consistent dark slate background theme (`#0c0d12`) to the global Footer component to resolve light-mode branding visibility.

---

## [v2.3.0] - 2026-06-11
### Added
- **Static Site Generation (SSG) Pre-rendering**: Created a custom postbuild Node script (`scripts/prerender.cjs`) to automatically pre-render specific `<title>`, Canonical links, Open Graph, and Twitter metadata tags into static `index.html` pages for all 368 colleges (located at `dist/college/[collegeCode]/index.html`), resolving client-side rendering preview limitations on WhatsApp and Telegram.
- **Locked Merit List Autoload Panel**: Integrated a mockup autoload form panel inside the Homepage recommendations form, including an active Application ID roll-number input and a locked, semi-transparent overlay explaining CET merit list timeline releases.
- **CAP Admission Guide Timeline**: Added a dedicated `HelpPage` (`/help`) rendering the 10 stages of the Centralized Admission Process (CAP) with real-time status pills and official CET Cell publications links.
- **Mathematical Prediction Formula Displays**: Updated the `HowItWorksPage` to detail weighted historical averaging cutoffs and logistic sigmoid probability math in clean styled equations.
- **Student Privacy Guarantee Section**: Documented our 100% database-free client-side architecture on the `AboutPage` to guarantee that student ranks/scores are never collected, tracked, or sold to coaching institutes.

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
