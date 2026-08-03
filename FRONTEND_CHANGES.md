# Notari (local) - Frontend Architecture & Replication Specification

**Repository**: [https://github.com/hemantrillion/Notari-local---Tag-driven-archive-and-search-engine](https://github.com/hemantrillion/Notari-local---Tag-driven-archive-and-search-engine)

---

## 1. Project Directory & File Tree

```text
c:\Users\jai18\Desktop\link-archive-app\
├── package.json                          # Root runner launching backend (5005) & frontend (5173) concurrently
├── FRONTEND_CHANGES.md                   # Full frontend architectural specification & change log
├── BACKEND_CHANGES.md                    # Full backend architectural specification & change log
├── frontend/
│   ├── index.html                        # HTML entry point with root element <div id="root"></div>
│   ├── vite.config.js                    # Vite bundler configuration (dev server running on port 5173)
│   ├── package.json                      # Frontend dependencies (React, Lucide icons, etc.)
│   └── src/
│       ├── main.jsx                      # React application bootstrap rendering <App />
│       ├── App.jsx                       # Main application component & state coordinator (~182 KB)
│       ├── index.css                     # Primary visual CSS variables, flex layouts, responsive rules
│       ├── theme.css                     # Color palettes, dark/light theme definitions, card styles
│       ├── components/
│       │   ├── MediaPlayerModal.jsx      # In-app media player modal for videos/images
│       │   ├── WebsiteDetailView.jsx     # Rendered Webpage / Website HTML view with styling controls
│       │   ├── WebsiteFrontendPlayground.jsx # Left-side simulated mobile frame for share testing
│       │   ├── WordEditor.jsx            # Rich-text tag editor (Title, Tags, urlId, Body)
│       │   └── NavigationControls.jsx    # Header navigation buttons (alback, home)
│       └── utils/
│           └── media.js                  # Helper utilities for media extraction & parsing
```

---

## 2. Naming Conventions & Terminology Glossary

* **`web mints`**: The 3 top-right webpage action control buttons (`Default View`, `Design Page`, `Edit`) rendered inside a Webpage/Website Detail View ([WebsiteDetailView.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/WebsiteDetailView.jsx)).
* **`ham` / `ham icon`**: The 3-line hamburger menu icon located at the top-left of the main header. Toggles the floating sidebar navigation drawer (`SidebarDrawerModal.jsx`).
* **`alback`**: The top-left back button icon located next to `ham`. Navigates back to the previous screen/view in the application history.
* **`home`**: The top-left home button icon located in the main header. Direct shortcut to return to the homepage search screen.
* **`triple t`**: The bottom icon bar of the sidebar navigation drawer containing 3 rounded square buttons (1st icon toggles Light/Dark mode, 2nd & 3rd icons are empty slots reserved for future feature modules).
* **`SERP`**: Search Engine Results Page, landed upon submitting a tag query from the central search box. Displays results under `All`, `Images`, and `Videos` tabs.
* **`urlId` (`readableCode`)**: The unique readable sequential identifier generated for every link (`{source}-{type}-{tagCode}-{DD}-{MMYY}-{suffix}`).
* **`Webpage` / `Website`**: The formatted HTML page generated when a saved link is viewed or customized.
* **`Tag Now`**: Native share dialog option that immediately redirects to the app and opens the Tag Editor modal (`TagEditorModal.jsx`).
* **`Tag Later`**: Native share dialog option that saves the link directly to the Untagged Dashboard in the background with default tag code `0000`.

---

## 3. Detailed Component & UI Layout Specifications

### 3.1 App Header & Navigation Bar
* **File & Lines**: [frontend/src/App.jsx:L1030-L1075](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx#L1030-L1075)
* **Placement & Styling**:
  * Positioned fixed at the top (`width: 100%`, `height: 60px`, `background: var(--bg-header)`, `border-bottom: 1px solid var(--border-color)`).
  * Uses a flexbox layout (`display: flex`, `align-items: center`, `padding: 0 16px`, `justify-content: space-between`).
* **Elements**:
  1. **`ham` Icon** (`App.jsx#L1034`): `<button className="ham-btn">` rendering a 3-line SVG hamburger icon. Clicking triggers `setDrawerOpen(!drawerOpen)`.
  2. **`alback` Button** (`App.jsx#L1050`): `<button className="alback-btn">` rendering a back chevron icon. Clicking calls `handleGoBack()`.
  3. **`home` Button** (`App.jsx#L1062`): `<button className="home-btn">` rendering a house icon. Clicking sets `setCurrentView('home')`.

---

### 3.2 Sidebar Navigation Drawer
* **File & Lines**: [frontend/src/App.jsx:L1080-L1210](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx#L1080-L1210)
* **Placement & Layout**:
  * Positioned `fixed`, `top: 0`, `left: 0`, `height: 100vh`, `width: 280px`, `z-index: 1000`.
  * Animates smoothly via CSS transform (`transform: translateX(-100%)`, opens with `.open { transform: translateX(0) }`).
* **Navigation Items Table**:

| Item Name | Target View | Functionality & State Trigger |
| :--- | :--- | :--- |
| **Home** | `'home'` | Returns to central search & recents screen |
| **Tagged Dashboard** | `'tagged'` | Displays grid of all links assigned custom tag codes |
| **Untagged Dashboard** | `'untagged'` | Displays grid of raw links assigned default tag code `0000` |
| **Tags Registry** | `'tags'` | Displays table/list of all tag codes & labels |
| **Sources Registry** | `'sources'` | Displays list of platform sources (Instagram, YouTube, etc.) |
| **Themes Dashboard** | `'themes'` | Customizes global app color schemes and fonts |
| **`[Currently stable - don't touch]` Logs** | `'logs'` | **Dual sub-tabs**: *Change Logs* & *Audit Logs* listing all system changes |

* **`triple t` Bottom Icon Bar** (`App.jsx#L1170-L1205`):
  * Located at the very bottom of the sidebar drawer (`display: flex`, `gap: 12px`, `padding: 16px`).
  * **Icon 1 (Theme Toggle)**: Toggles dark/light mode CSS classes (`dark-theme` / `light-theme`) on `document.body`.
  * **Icon 2 & 3 (Empty Squares)**: Rounded square containers (`width: 36px`, `height: 36px`, `border-radius: 8px`, `border: 1px dashed var(--border-color)`) reserved for future feature modules.

---

### 3.3 Left-Side Phone Simulator (`WebsiteFrontendPlayground.jsx`)
* **File & Lines**: [frontend/src/components/WebsiteFrontendPlayground.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/WebsiteFrontendPlayground.jsx)
* **Placement & Design**:
  * Fixed container on the left side of the desktop viewport (`width: 380px`, `height: calc(100vh - 80px)`, `margin: 10px`, `border-radius: 36px`, `border: 12px solid #222`).
* **Functionality**:
  * Provides mock web browsing and a YouTube search engine simulator.
  * Clicking **Share** on any mock video/page triggers the in-app Share Dialog Modal (`Tag Now` or `Tag Later`).
    * **`Tag Later`**: Sends `POST /api/links` with `primaryTagLabel: ''` (assigned tag `0000`), adds entry to Untagged Dashboard silently.
    * **`Tag Now`**: Opens `WordEditor.jsx` tag editor overlay.

---

### 3.4 Homepage & Search Engine
* **File & Lines**: [frontend/src/App.jsx:L1300-L1490](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx#L1300-L1490)
* **Elements**:
  1. **Central Tag Search Box**:
     * Styled as a prominent rounded pill container (`max-width: 600px`, `margin: 40px auto`, `border-radius: 24px`, `box-shadow: 0 4px 16px rgba(0,0,0,0.1)`).
     * Input handler splits space-separated terms and auto-formats query strings with a fixed `|` tag delimiter (e.g. `tag1|tag2`).
     * Submitting triggers tag search and transitions `currentView` to `'serp'`.
  2. **Recents Section**:
     * Positioned directly below the search box.
     * Renders a responsive grid (2–4 columns) displaying the last 10 to 20 tagged **Webpages/Websites**.
     * Each card displays the Webpage title, primary tag pill, source badge, creation date, and a **Play Button** icon.

---

### 3.5 SERP (Search Engine Results Page)
* **File & Lines**: [frontend/src/App.jsx:L1500-L1800](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx#L1500-L1800)
* **Layout**:
  * Renders a top tab bar with 3 sub-views:

```text
┌───────────────────────────────────────────────────────────┐
│  [ All (12) ]      [ Images (24) ]      [ Videos (8) ]    │
└───────────────────────────────────────────────────────────┘
```

  * **`All` Tab**: Displays all matching **Webpage/Website** cards.
  * **`Images` Tab**: Filters and displays image assets extracted from matching Webpages. Images inherit the tags of their host Webpage.
  * **`Videos` Tab**: Filters and displays video assets extracted from matching Webpages. Videos inherit the tags of their host Webpage.

---

### 3.6 Webpage / Website Detail View (`WebsiteDetailView.jsx`)
* **File & Lines**: [frontend/src/components/WebsiteDetailView.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/WebsiteDetailView.jsx)
* **Functionality**:
  * Renders the full saved HTML document view for any selected link.
  * Top toolbar includes theme selection dropdowns, typography/font controls, font size sliders, and an **Edit** button (which opens `WordEditor.jsx`).
  * Features a prominent **Play Button** to launch the media viewer.

---

### 3.7 In-App Media Player Modal (`MediaPlayerModal.jsx`)
* **File & Lines**: [frontend/src/components/MediaPlayerModal.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/MediaPlayerModal.jsx)
* **Triggering Locations**:
  * **Play Buttons** located inside:
    1. Tagged Dashboard link cards
    2. Untagged Dashboard link cards
    3. Webpage/Website Detail View header
* **Functionality**:
  * Opens a sleek dark overlay modal (`position: fixed`, `inset: 0`, `z-index: 2000`).
  * Automatically detects URL type:
    * YouTube links: Renders embedded `<iframe>` player.
    * Video files (`.mp4`, `.webm`): Renders native HTML5 `<video controls autoplay>`.
    * Image files (`.png`, `.jpg`): Renders responsive lightbox image viewer.

---

### 3.8 Tag Editor & Word Editor (`WordEditor.jsx`)
* **File & Lines**: [frontend/src/components/WordEditor.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/WordEditor.jsx)
* **Fields & Data Mapping**:

| Field Name | Component Control | Source Data / Formatting Rule |
| :--- | :--- | :--- |
| **Title** | Text Input | Webpage title |
| **URL** | Text Input (Disabled) | Shared link URL |
| **Primary Tag** | Input / Dropdown | Primary tag label (defaults to `0000` if untagged) |
| **Source Platform**| Dropdown Selector | Platform code (`ytb`, `ins`, `gfg`, `git`, `web`) |
| **`urlId` (`readableCode`)** | Text Input (Read-only) | Computed ID: `{source}-{type}-{tagCode}-{DD}-{MMYY}-{suffix}` |
| **Body Content** | Rich-Text Editor Area | Formatted notes, HTML content, or article body text |

---

## 4. Recent Changes Log

### Change 1: Triple T Sidebar Footer Spacing & Alignment Fix
* **Goal**: I wanted to fix the `triple t` icon bar at the bottom of the sidebar navigation drawer so that the icons have equal padding at the bottom (preventing them from touching or clipping against the drawer bottom edge) and have wider horizontal spacing between each of the 3 icons.
* **Actions**:
  * Modified the `.drawer-footer` container inline styles in [frontend/src/App.jsx:L1155](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx#L1155).
  * Replaced `paddingTop: '16px'` with `padding: '16px 0'` to enforce symmetric 16px top and bottom padding.
  * Increased the flexbox `gap` between the 3 rounded square icons from `12px` to `18px`.

### Change 2: Floating Windows Extraction & Responsive Ratio-Based Styling
* **Goal**: I wanted to refactor all 4 floating windows (Sidebar Navigation Drawer, Create New Tag Modal, Create New Source Modal, and Tag Editor Modal) out of `App.jsx` into a dedicated modular structure (`frontend/src/components/floating-windows/`), remove the top divider line above `triple t`, and convert hardcoded pixel offsets into device-responsive ratio/percentage styling while keeping floating windows locked to Default Theme (with Light/Dark support).
* **Actions**:
  * Created [SidebarDrawerModal.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/floating-windows/SidebarDrawerModal.jsx) for the floating sidebar drawer, removing the `borderTop` divider line above `triple t` and applying ratio spacing (`gap: 8%`, `paddingTop: 3vh`, `paddingBottom: 3vh`).
  * Created [CreateTagModal.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/floating-windows/CreateTagModal.jsx) for the floating tag creation modal with `default-theme-isolated` class.
  * Created [CreateSourceModal.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/floating-windows/CreateSourceModal.jsx) for the floating source creation modal with `default-theme-isolated` class.
  * Created [TagEditorModal.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/floating-windows/TagEditorModal.jsx) wrapping `WordEditor.jsx` inside a floating modal container.
  * Updated [App.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx) to import and render these 4 floating window components cleanly.

### Change 3: Web Mints Spacing, Profile Outline & 11-Theme Engine Overhaul
* **Goal**: I wanted to remove the redundant inner webpage back button, increase vertical spacing for `web mints` (the 3 top-right webpage action control buttons: Default View, Design Page, Edit), add a bold black circular outline to the header profile icon (`u`), and overhaul the Themes Dashboard into a 2-column wide rectangle grid with live interactive app view previews backed by a dedicated theme module (`frontend/src/themes/`).
* **Actions**:
  * Removed the redundant inner back button (`←`) inside [WebsiteDetailView.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/WebsiteDetailView.jsx).
  * Designated the 3 webpage action buttons (`Default View`, `Design Page`, `Edit`) as **`web mints`** (custom term for webpage action controls) and increased ratio-based top padding (`paddingTop: 2.5vh`, `paddingBottom: 2vh`, `marginBottom: 3vh`).
  * Updated `.avatar` in [index.css](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/index.css#L148-L159) to add a 2.5px solid bold black circular border outline around the profile icon (`u`).
  * Created [themeRegistry.js](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/themes/themeRegistry.js) and [themes.css](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/themes/themes.css) defining 11 design environments (*Default, Spatial UI, Bento Grid, Liquid Glass, Brutalism, Maximalism, Minimalism, Claymorphism, Glassmorphism, Neomorphism, Skeuomorphism*), each with Light and Dark variants.
  * Overhauled the Themes Dashboard in [App.jsx:L2250-L2295](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx#L2250-L2295) into a 2-column wide rectangle grid with live app view preview section and removed obsolete static text and back buttons.

### Change 4: Sidebar Drawer Absolute Anchoring, Midnight Dark System & Theme Dashboard Previews Re-ordering
* **Goal**: I wanted to fix the floating sidebar drawer so that it anchors inside `.app-side` (instead of popping out over the Phone Simulator on the far left), fix dark mode CSS variable overrides so the entire application and floating windows switch to a true midnight dark theme with white text, and re-order the Themes Dashboard to place the 3 mini page structure previews (Homepage, SERP, Webpage) BELOW all 11 uniform theme selection cards.
* **Actions**:
  * Updated [SidebarDrawerModal.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/floating-windows/SidebarDrawerModal.jsx) to use `position: absolute; inset: 0` inside `.app-side`, creating a floating drawer container with `borderRadius: 16px` and clean dark/light mode surface tokens (`#1e1e1e` in dark mode).
  * Updated `.app-side` and `.app-header` in [index.css](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/index.css#L59-L80) to use `var(--bg-app)` and `var(--bg-card)` instead of hardcoded white `#ffffff`.
  * Updated [themes.css](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/themes/themes.css) and [App.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx) to synchronize `mode-dark` and `mode-light` on `document.body` and ensure `.default-theme-isolated` elements inherit dark mode backgrounds (`#18181b`) and white text (`#f4f4f5`).
  * Re-ordered the Themes Dashboard in [App.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx) to display the 11 uniform wide theme cards first, followed by the Live App View Preview section BELOW all options, featuring 3 mini structural representations: Homepage Search, SERP Results, and Webpage View.

### Change 5: JSX Build Syntax Fix, Themes Dashboard Cards Compact Refactor & Preview Section Miniatures
* **Goal**: I wanted to fix the Vite JSX build compilation syntax error in `App.jsx`, update the Themes Dashboard cards to be compact without "Active" badges and use standard system typography, restructure the Themes Preview section to render 4 distinct miniature page cards (Homepage, Webpage Detail with `web mints` badge, Tagged Table, Logs Dashboard), fix the profile icon (`u`) click crash, purge obsolete duplicate back buttons and text, and adjust upper spacing for `web mints`.
* **Actions**:
  * Fixed the broken JSX structure and unclosed block tags around line 2420–2530 in [App.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx), restoring clean production build compilation (`npx vite build` completed with 0 errors).
  * Refactored the 11 theme cards in the Themes Dashboard inside [App.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx) to use compact styling (`padding: 0.85rem 1.25rem`), removed "Active" text badges, and applied standard app font family `var(--font-family)`. Selection is cleanly indicated via a `2.5px solid var(--accent)` highlight border.
  * Overhauled the Themes Preview section in [App.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx) with a clean header titled **`Preview`** and 4 miniature page representation cards:
    1. **Mini Homepage View Card**: Displaying app title `A Sap Link`, search pill, and link item badge.
    2. **Mini Webpage Detail View Card**: Displaying page title, URL, notes snippet, and top-right **`web mints`** action badge.
    3. **Mini Tagged Dashboard Table Card**: Displaying table header (`URL ID`, `HEADING`, `TAG`) and data row.
    4. **Mini Logs Dashboard Card**: Displaying sub-tabs `Change Logs` / `Audit Logs` and audit item.
  * Removed unnecessary subtitle text *"System change and audit activity records."* from the Logs Dashboard tab in [App.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx).
  * Purged all remaining duplicate inline back buttons (`←`) from webpage views in [App.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx) and increased top spacing above `web mints` controls in [WebsiteDetailView.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/WebsiteDetailView.jsx).
  * Added missing `isLocalStorageEnabled` state in [App.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx), fixing the crash when clicking the profile avatar (`u`).

### Change 6: Global Webpage Detail View Rendering & Modular Dashboard Architecture Extraction
* **Goal**: I wanted to fix the critical bug where clicking a link from non-home dashboards (Tagged, Untagged, etc.) failed to open the webpage detail view by moving `<WebsiteDetailView>` to render globally at top-level `.app-content` when `activeViewLink !== null`. Additionally, I refactored and extracted all 8 inline dashboard views from `App.jsx` into separate, modular component files inside `frontend/src/components/dashboards/`.
* **Actions**:
  * Moved `<WebsiteDetailView>` outside of `{activeTab === 'home' && (...)}` in [App.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx) to render globally inside `.app-content` whenever `activeViewLink !== null`. Clicking `onBack` (`←`) sets `activeViewLink` to `null` and instantly returns to whichever dashboard tab was active (`home`, `tagged`, `untagged`, `tags`, `sources`, `profile`, `themes`, `logs`).
  * Created modular dashboard components inside [frontend/src/components/dashboards/](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/dashboards/):
    * [HomeDashboard.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/dashboards/HomeDashboard.jsx): Central search bar, Google-style SERP tabs (`All`, `Images`, `Videos`), and Recent Additions feed.
    * [UntaggedDashboard.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/dashboards/UntaggedDashboard.jsx): Table view for untagged links with clickable URL IDs to view webpage detail.
    * [TaggedDashboard.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/dashboards/TaggedDashboard.jsx): Table view for tagged links with clickable Headings and URL IDs to view webpage detail.
    * [TagsRegistryDashboard.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/dashboards/TagsRegistryDashboard.jsx): Tag management registry table with create and delete actions.
    * [SourcesRegistryDashboard.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/dashboards/SourcesRegistryDashboard.jsx): Platform source management registry table.
    * [ProfileDashboard.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/dashboards/ProfileDashboard.jsx): Workspace profile settings and local storage toggle.
    * [ThemesDashboard.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/dashboards/ThemesDashboard.jsx): Compact 11-theme selection cards and miniature page structure previews.
    * [LogsDashboard.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/dashboards/LogsDashboard.jsx): Dual sub-tab (`Change Logs` & `Audit Logs`) activity feed without subtitles or emojis.
  * Updated [App.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx) to import and render all 8 modular dashboard components cleanly, reducing file size from 2,650 lines down to ~1,350 lines while preserving clean compilation (`npx vite build` succeeded with 0 errors).

### Change 7: Modular Per-Theme CSS Files, Theme Removal & Selenium Element Detection Fixes
* **Goal**: I wanted to remove the 3 requested themes (`glassmorphism`, `spatial_ui`, `liquid_glass`), create a dedicated individual CSS file for each remaining theme under `frontend/src/themes/`, and add unique ID attributes across all dashboards to ensure 100% element visibility and reliable detection for Selenium and automated test suites.
* **Actions**:
  * Removed `spatial_ui`, `liquid_glass`, and `glassmorphism` from [themeRegistry.js](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/themes/themeRegistry.js), [themes.css](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/themes/themes.css), and `THEME_OPTIONS` in [App.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx).
  * Created 8 individual per-theme CSS files in [frontend/src/themes/](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/themes/):
    * [default.css](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/themes/default.css)
    * [bento_grid.css](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/themes/bento_grid.css)
    * [brutalism.css](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/themes/brutalism.css)
    * [maximalism.css](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/themes/maximalism.css)
    * [minimalism.css](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/themes/minimalism.css)
    * [claymorphism.css](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/themes/claymorphism.css)
    * [neomorphism.css](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/themes/neomorphism.css)
    * [skeumorphism.css](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/themes/skeumorphism.css)
  * Updated [themes.css](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/themes/themes.css) to import all 8 theme CSS files via `@import`.
  * Added unique `id` attributes across all dashboard containers and interactive elements (`#search-input`, `#home-dashboard`, `#tagged-table`, `#untagged-table`, `#tags-registry-table`, `#sources-registry-table`, `#profile-dashboard`, `#themes-dashboard`, `#logs-dashboard`, `#website-detail-view`, `#web-mints-toolbar`) to guarantee 100% element detection by Selenium and automated testing tools.

### Change 8: Fix Missing Component Imports for App Rendering
* **Goal**: I wanted to fix the runtime rendering issue causing the app screen to fail to load in browser by restoring missing component imports in `App.jsx`.
* **Actions**:
  * Added missing imports for `WebsiteDetailView` (`import WebsiteDetailView from './components/WebsiteDetailView';`) and `MediaPlayerModal` (`import MediaPlayerModal from './components/MediaPlayerModal';`) at the top of [App.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx).
  * Verified that Vite transforms all 34 component modules cleanly without runtime reference errors and tested production compilation (`npx vite build` succeeded in 120ms).

### Change 9: CSS Root Fallback Tokens & Saved Theme State Validation
* **Goal**: I wanted to ensure that the screen rendering is 100% reliable and guaranteed under all circumstances by adding complete fallback CSS variable tokens to `:root` in `index.css` and validating local storage theme state against active theme definitions.
* **Actions**:
  * Updated `:root` in [index.css](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/index.css) to define baseline default tokens (`--bg-app`, `--bg-header`, `--bg-card`, `--text-color`, `--border-color`, `--accent-color`, `--box-shadow`, `--font-family`), preventing blank or unrendered screens even if an unknown or legacy theme class is present.
  * Updated `appTheme` state initialization in [App.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx) to validate saved local storage values against `THEME_OPTIONS`, cleanly defaulting to `'default'` if a previously selected theme was removed.

### Change 10: Preloaded Fallback Initial State & Backend Offline Resilience
* **Goal**: I wanted to ensure that the application dashboard renders rich, populated data immediately upon launch (even if the backend database is empty or offline) by initializing `links`, `tags`, and `sources` state with preloaded demo datasets.
* **Actions**:
  * Added `DEFAULT_INITIAL_TAGS`, `DEFAULT_INITIAL_SOURCES`, and `DEFAULT_INITIAL_LINKS` to [App.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx).
  * Initialized `links`, `tags`, and `sources` React state using these preloaded datasets, guaranteeing that all dashboards (Home, Tagged, Tags Registry, Sources Registry, Detail View) display full interactive content immediately upon page load.

### Change 11: 3-Layer Future-Proof Error Boundary, Shared Formatters & Defensive Default Props
* **Goal**: I wanted to permanently eliminate the root cause of blank white screen collapses (`ReferenceError: displayUrl is not defined`) by creating a shared formatters utility, wrapping `<App />` in a top-level React `<ErrorBoundary>`, and adding defensive default props across all 8 dashboard components.
* **Actions**:
  * Created [formatters.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/utils/formatters.jsx) exporting `displayUrl`, `formatDate`, `formatTime`, and `getCleanTextExcerpt` utility functions.
  * Created [ErrorBoundary.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/ErrorBoundary.jsx) and wrapped `<App />` in [main.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/main.jsx) to prevent unhandled runtime exceptions from collapsing the React root tree into a white screen.
  * Added defensive default parameter values across all 8 modular dashboard components (`HomeDashboard`, `TaggedDashboard`, `UntaggedDashboard`, `TagsRegistryDashboard`, `SourcesRegistryDashboard`, `ProfileDashboard`, `ThemesDashboard`, `LogsDashboard`), ensuring safe fallback rendering under all prop conditions.
  * Verified 100% clean production compilation (`npx vite build` succeeded with 36 modules transformed in 114ms).

### Change 12: Fix Delete Handler References, Clean Themes Preview & Profile Layout, Oval Toolbar Pills
* **Goal**: I wanted to fix the missing delete handlers for Tags and Sources dashboards (`handleDeleteTag`, `handleDeleteSource`), remove unnecessary theme settings/preview sections from Profile and Themes dashboards, and restore single-line oval pill toolbar buttons in `WebsiteDetailView`.
* **Actions**:
  * Defined `handleDeleteTag` and `handleDeleteSource` in [App.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx) and passed them to `TagsRegistryDashboard` and `SourcesRegistryDashboard`, resolving the runtime `ReferenceError` crashes.
  * Removed the miniature preview cards canvas from [ThemesDashboard.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/dashboards/ThemesDashboard.jsx).
  * Removed the redundant Theme Settings section from [ProfileDashboard.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/dashboards/ProfileDashboard.jsx).
  * Updated toolbar buttons in [WebsiteDetailView.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/WebsiteDetailView.jsx) with `borderRadius: '30px'` and `whiteSpace: 'nowrap'`, restoring single-line oval pill buttons ("Default View", "Design Page", "Edit").
  * Tested production compilation (`npx vite build` succeeded in 250ms with 36 modules transformed).

### Change 13: Restore Rich Themes Selector, Circular Profile Avatar & Proxy Web Previews
* **Goal**: I wanted to restore the rich visual theme cards in `ThemesDashboard` with a clean `Preview` section header, fix circular profile avatar rendering and navigation, and bypass iframe `X-Frame-Options` blocks when opening web link previews in `MediaPlayerModal`.
* **Actions**:
  * Restored rich visual theme cards (with live theme style accents and Active badges) in [ThemesDashboard.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/dashboards/ThemesDashboard.jsx) while keeping the clean `Preview` section heading (omitting only the miniature structure cards).
  * Styled `.avatar` in [index.css](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/index.css) as a clean, circular profile badge and added Profile navigation entry in [SidebarDrawerModal.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/floating-windows/SidebarDrawerModal.jsx).
  * Updated web preview iframe in [MediaPlayerModal.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/MediaPlayerModal.jsx) to use `http://localhost:5005/api/proxy?url=...`, allowing external sites (like Hacker News `news.ycombinator.com`) to preview cleanly inside the modal.
  * Verified production build (`npx vite build` succeeded in 130ms with 36 modules transformed).

### Change 14: Minimalist Themes Grid Layout & Prominent Circular Profile Ring
* **Goal**: I wanted to simplify `ThemesDashboard` into a clean grid of rounded rectangular cards with uniform text (removing "Theme Settings" text, "Active" badges, and inner preview boxes) and give the Profile header icon a prominent 36px circular boundary ring.
* **Actions**:
  * Updated [ThemesDashboard.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/dashboards/ThemesDashboard.jsx) to render a clean 2-column grid of rounded rectangular cards with uniform theme name text, removing header titles, active badges, and inner color bars.
  * Styled `profile-circle-btn` in [App.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/App.jsx) header with explicit 36px circular dimensions (`borderRadius: '50%'`, `border: '2px solid var(--accent)'`, `boxShadow: '0 2px 6px rgba(26, 115, 232, 0.3)'`), placing a sharp circular boundary around the profile icon.
  * Verified production build (`npx vite build` succeeded cleanly in 125ms with 36 modules transformed).

### Change 15: Clean Theme Box Cards & Double Ring Circular Profile Boundary
* **Goal**: I wanted to refine the Themes Dashboard layout to render compact paired rounded rectangular boxes with uniform text and give the Profile header icon a high-visibility double ring circular boundary.
* **Actions**:
  * Refined [ThemesDashboard.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/dashboards/ThemesDashboard.jsx) to render a clean 2-column grid of compact rounded rectangular boxes (`padding: 14px 20px`, `borderRadius: 12px`) with uniform theme name text, omitting titles, active badges, and inner dashed lines.
  * Added `.profile-circle-btn` in [index.css](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/index.css) with double ring circular boundary styling (`box-shadow: 0 0 0 2px var(--bg-header), 0 0 0 4px var(--accent)`), creating a sharp outer ring around the Profile avatar button.
  * Tested production compilation (`npx vite build` succeeded in 123ms with 36 modules transformed).

### Change 16: Uniform Theme Cards & Restored Preview Section Container
* **Goal**: I wanted to ensure that all 8 theme option cards have 100% identical uniform box styling and restore the Preview section container with its "Preview" heading below the theme cards.
* **Actions**:
  * Removed per-card theme overrides (`theme-${theme.id}`) from theme selector buttons in [ThemesDashboard.jsx](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/components/dashboards/ThemesDashboard.jsx), guaranteeing 100% uniform fonts, borders, shadows, and rounded rectangular box shapes across all theme options.
  * Restored the Preview canvas container with its "Preview" section heading below the theme cards (omitting only the 4 miniature structure cards inside).
  * Tested production compilation (`npx vite build` succeeded in 123ms with 36 modules transformed).

### Change 17: 16 Dedicated Theme Files (8 Themes x 2 Modes: Light & Dark)
* **Goal**: I wanted to restructure the theme system into 16 separate, dedicated CSS files under `frontend/src/themes/` (one for every theme and light/dark mode combination) reflecting the design language in the visual sample image.
* **Actions**:
  * Created 16 dedicated CSS files in [themes/](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/themes/):
    - `default_light.css` / `default_dark.css`
    - `bento_grid_light.css` / `bento_grid_dark.css`
    - `brutalism_light.css` / `brutalism_dark.css`
    - `maximalism_light.css` / `maximalism_dark.css`
    - `minimalism_light.css` / `minimalism_dark.css`
    - `claymorphism_light.css` / `claymorphism_dark.css`
    - `neomorphism_light.css` / `neomorphism_dark.css`
    - `skeumorphism_light.css` / `skeumorphism_dark.css`
  * Updated [themes.css](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/themes/themes.css) to import all 16 theme files via `@import`.
  * Preserved floating window modal isolation (`default-theme-isolated`), ensuring modals adapt cleanly to Light/Dark mode without visual theme distortions.
  * Verified production build (`npx vite build` succeeded in 128ms with 36 modules transformed).

### Change 18: High-Fidelity Light Mode Theme Refinement
* **Goal**: I wanted to refine all 8 Light Mode theme CSS files (`default_light.css`, `bento_grid_light.css`, `brutalism_light.css`, `maximalism_light.css`, `minimalism_light.css`, `claymorphism_light.css`, `neomorphism_light.css`, `skeumorphism_light.css`) to match the visual reference sample cards, while keeping floating modals isolated with default styling.
* **Actions**:
  * Refined 8 Light Mode theme files:
    - `default_light.css`: Modern Google-style baseline system.
    - `bento_grid_light.css`: Modular grid cards, indigo soft shadows (`0 8px 24px rgba(99,102,241,0.08)`), Outfit font.
    - `brutalism_light.css`: Vibrant yellow canvas (`#fef08a`), 3px solid black borders, hard 4px offset black shadows.
    - `maximalism_light.css`: Loud typography, pink/green accents (`#d946ef`), Syne font.
    - `minimalism_light.css`: Ultra-clean monochrome whitespace, 1px thin borders (`#e5e5e5`), zero shadows.
    - `claymorphism_light.css`: Sky blue backdrop (`#7dd3fc`), 3D inflated white clay cards with dual inset/outset glows.
    - `neomorphism_light.css`: Seamless monochromatic soft gray canvas (`#e0e5ec`), soft extruded dual light/dark shadows.
    - `skeumorphism_light.css`: Tactile metallic silver gradients, beveled panels, and real-world inset shadows.
  * Preserved modal isolation (`default-theme-isolated`), keeping floating windows clean and unpolluted.
  * Verified production build (`npx vite build` succeeded in 148ms with 36 modules transformed).

# Element-by-Element Light Mode Theme Specifications
This document outlines the exact 3-layer visual theme specifications for all 7 Light Mode themes based on the reference image (with Bento Grid canvas set to pure white #ffffff), awaiting your explicit signal before writing any code.

1. Bento Grid (Top Left in Image)
Background Canvas: Pure white backdrop (#ffffff).
App Header Bar: Pure white (#ffffff), thin indigo bottom border (rgba(99, 102, 241, 0.15)), 0px shadow.
Search Bar: Pure white (#ffffff), 20px rounded pill corners, zero border, soft indigo ambient drop shadow (0 8px 24px rgba(99,102,241,0.08)).
Cards & Feed Containers: 20px rounded pill corners, zero border, soft ambient drop shadow (0 8px 24px rgba(0,0,0,0.05)). Cards cycle through 5 alternating pastel background fills:
Pastel Lavender (#e9d5ff card, #581c87 text)
Pastel Mint Green (#d9f99d card, #1a2e05 text)
Pastel Pink (#fbcfe8 card, #831843 text)
Pastel Cyan (#bae6fd card, #0c4a6e text)
Pastel Coral Orange (#ffedd5 card, #7c2d12 text)
Dashboard Tables & Rows: Single horizontal row wrapper, 20px rounded end-caps, pastel lavender background (#e9d5ff), zero border.
Badges & Tags: Rounded pastel pill badges with dark contrasting micro-text.
Buttons & Toolbar Pills: Oval pill buttons (border-radius: 30px), indigo fill (#6366f1), soft hover lift (transform: translateY(-2px)).
Micro-Graphics: Modular bento tiles, star/heart/check icon badges.
Typography: Geometric sans-serif (Outfit / Plus Jakarta Sans).

2. Brutalism (Top Right in Image)
Background Canvas: Soft periwinkle canvas (#e0e7ff).
App Header Bar: Pure white (#ffffff), 3px solid black bottom border (#000000).
Search Bar: Pure white (#ffffff), 2px sharp corners, 3px solid black border (#000000), hard black 4px offset box-shadow (4px 4px 0px #000000) with zero blur.
Cards & Feed Containers: Rectangular card containers with 3px solid black borders (#000000), hard 4px black offset drop-shadows (4px 4px 0px #000000), 2px sharp corners. Cards cycle through vibrant Brutalist card fills (pure white #ffffff, sunny yellow #ffe600, mint green #4ade80, cyan #38bdf8, neon pink #ff3366).
Dashboard Tables & Rows: Single horizontal row wrapper, 2px sharp end-caps, white background, 3px solid black border, hard 4px black offset shadow.
Badges & Tags: Rectangular tags with 2px solid black borders and solid yellow or neon pink fills.
Buttons & Toolbar Pills: Heavy rectangular buttons with 3px solid black borders, neon pink/cyan/green fills, and hard 4px black offset shadows (4px 4px 0px #000000).
Click physics: Button depresses by 4px (transform: translate(4px, 4px)), flattening the offset shadow to 0px on click.
Micro-Graphics: 3 circular window header dots (red #ff5555, yellow #ffbd2e, green #27c93f) on card headers, thick black dividing lines.
Typography: Monospaced display font (Space Grotesk / Courier).

3. Maximalism (Middle Left in Image)
Background Canvas: 45-degree electric lime green & white diagonal chevron/stripe wallpaper pattern (repeating-linear-gradient(45deg, #00ff44 0px, #00ff44 24px, #ffffff 24px, #ffffff 48px)).
App Header Bar: Pure black (#000000), electric lime green logo text (#00ff44), 4px solid black bottom border.
Search Bar: Pure white (#ffffff), 4px corner radius, 4px solid black border, 6px solid black offset shadow (6px 6px 0px #000000).
Cards & Feed Containers: Pure white card containers (#ffffff), 4px solid black borders, 6px solid black offset shadows (6px 6px 0px #000000), 4px border radius.
Dashboard Tables & Rows: Single horizontal row wrapper, 4px rounded end-caps, white background, 4px solid black border, 6px solid black shadow.
Badges & Tags: High-contrast black outline badges with lime green or magenta text.
Buttons & Toolbar Pills: Solid black action buttons with lime green/magenta text, 4px solid borders, scale boost on hover (transform: scale(1.03)).
Micro-Graphics: Black outline sponsor badges, giant display typography blocks.
Typography: Massive display font (Syne / Impact), bold all-caps display text.

4. Minimalism (Middle Center in Image)
Background Canvas: Soft warm paper off-white canvas (#f4f4f4 / #fafafa).
App Header Bar: Pure white (#ffffff), thin #e5e5e5 bottom border.
Search Bar: Pure white (#ffffff), 4px minimal border radius, ultra-thin 1px light gray border (#e5e5e5), zero box-shadow (none).
Cards & Feed Containers: Pure white card containers (#ffffff), 4px minimal border radius, ultra-thin 1px light gray border (#e5e5e5), zero box-shadow (none).
Dashboard Tables & Rows: Single horizontal row wrapper, 4px minimal end-caps, pure white background, thin 1px #e5e5e5 border, zero shadow.
Badges & Tags: Minimal white badges with thin gray borders and black text.
Buttons & Toolbar Pills: Minimal solid black pill buttons (#111111) with white text, zero shadow, thin crisp outline.
Micro-Graphics: Organic black pebble shapes, fine wireframe grid background lines, elegant serif header accents.
Typography: Neutral lightweight sans-serif (Inter / Helvetica Neue) with generous whitespace.

5. Claymorphism (Middle Right in Image)
Background Canvas: Vibrant Sky Blue backdrop canvas (#38bdf8 / #7dd3fc).
App Header Bar: Ice blue (#e0f2fe), thin #bae6fd bottom border.
Search Bar: 3D inflated pure white clay wrapper (#ffffff), 28px inflated rounded corners, dual 3D clay glow effect (box-shadow: inset -5px -5px 10px rgba(37,99,235,0.08), inset 5px 5px 10px rgba(255,255,255,0.95), 10px 16px 28px rgba(37,99,235,0.15)).
Cards & Feed Containers: 3D inflated pure white clay cards (#ffffff), 28px inflated rounded corners, signature dual top-left white inset highlight glow and bottom-right soft blue drop shadow.
Dashboard Tables & Rows: Single horizontal row wrapper, 28px inflated rounded end-caps, pure white clay background, dual 3D shadow glow.
Badges & Tags: Inflated clay pill badges with soft blue drop shadows.
Buttons & Toolbar Pills: 3D inflated blue clay action buttons (#2563eb), 30px pill radius, with top-left white inset highlight and soft blue drop shadow.
Micro-Graphics: Friendly rounded badge pills, soft 3D floating icons.
Typography: Soft rounded sans-serif (Fredoka / Quicksand).

6. Skeumorphism (Bottom Center in Image)
Background Canvas: Metallic silver-gray control panel surface (linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 100%)).
App Header Bar: Metallic vertical gradient (linear-gradient(180deg, #ffffff 0%, #e2e8f0 100%)), #cbd5e1 bottom border.
Search Bar: Metallic silver gradient container (linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)), 10px border radius, #cbd5e1 border, inset top white bevel highlight (inset 0 1px 0 rgba(255,255,255,0.9)).
Cards & Feed Containers: Metallic silver gradient card containers (linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)), 10px border radius, #cbd5e1 border, beveled inset panel highlights and tactile drop shadow (box-shadow: 0 3px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.1)).
Dashboard Tables & Rows: Single horizontal row wrapper, 10px beveled end-caps, metallic gradient fill, inset top white bevel highlight.
Badges & Tags: Metallic badges with debossed borders and steel blue text.
Buttons & Toolbar Pills: Convex metallic action buttons (linear-gradient(180deg, #0284c7 0%, #0369a1 100%)), top white bevel highlight, debossed border ring.
Micro-Graphics: Debossed panel tracks, rotary dial tick marks, LED status dots (green #10b981, red #ef4444).
Typography: Industrial serif (Georgia / Cinzel).

7. Neomorphism (Bottom Right in Image)
Background Canvas: Monochromatic soft plastic gray canvas (#e0e5ec).
App Header Bar: Soft gray (#e0e5ec), zero bottom border.
Search Bar: Soft gray inset field (#e0e5ec), inset neomorphic shadow (box-shadow: inset 6px 6px 10px #a3b1c6, inset -6px -6px 10px #ffffff), 20px rounded corners, zero border.
Dashboard Tables & Rows: Single horizontal row wrapper, 8px rounded end-caps, dark gray background (#1e1e1e), thin #3c4043 border.
Badges & Tags: Dark gray pill badges (#2d2f31) with light gray text (#e8eaed).
Buttons & Toolbar Pills: Bright Blue action buttons (#8ab4f8) with dark text (#121212) for maximum contrast; secondary buttons use #2a2a2a with white text (#ffffff).
Micro-Graphics: Google-style clean dark UI elements, subtle gray dividers.
Typography: Modern sans-serif ('Inter', system-ui, sans-serif).

2. Bento Grid (Dark Mode)
Background Canvas: Deep Night Charcoal backdrop (#0b0f19).
App Header Bar: Dark Charcoal (#111827), thin indigo bottom border (rgba(129, 140, 248, 0.2)), 0px shadow.
Search Bar: Deep dark gray (#1f2937), 20px rounded pill corners, zero border, soft dark indigo shadow (0 8px 24px rgba(0,0,0,0.4)).
Cards & Feed Containers: 20px rounded pill corners, zero border, soft ambient dark shadow (0 8px 24px rgba(0,0,0,0.5)). Cards cycle through 5 rich deep-toned dark pastel fills:
Deep Dark Lavender (#2e1065 card, #e9d5ff text)
Deep Dark Mint (#14532d card, #d9f99d text)
Deep Dark Pink (#701a75 card, #fbcfe8 text)
Deep Dark Cyan (#0c4a6e card, #bae6fd text)
Deep Dark Coral (#7c2d12 card, #ffedd5 text)
Dashboard Tables & Rows: Single horizontal row wrapper, 20px rounded end-caps, deep dark lavender background (#2e1065), zero border.
Badges & Tags: Rounded dark pastel pill badges with light contrasting micro-text.
Buttons & Toolbar Pills: Oval pill buttons (border-radius: 30px), bright indigo fill (#818cf8) with white text (#ffffff), soft hover lift (transform: translateY(-2px)).
Micro-Graphics: Dark bento tiles, star/heart/check icon badges.
Typography: Geometric sans-serif (Outfit / Plus Jakarta Sans).

3. Brutalism (Dark Mode)
Background Canvas: Dark Zinc canvas (#18181b).
App Header Bar: Dark Zinc (#27272a), 3px solid white bottom border (#ffffff).
Search Bar: Pure Dark Surface (#09090b), 2px sharp corners, 3px solid white border (#ffffff), hard white 4px offset box-shadow (4px 4px 0px #ffffff) with zero blur.
Cards & Feed Containers: Rectangular card containers (#09090b) with 3px solid white borders (#ffffff), hard 4px white offset drop-shadows (4px 4px 0px #ffffff), 2px sharp corners. Cards cycle through rich dark Brutalist fills (#09090b, #18181b, #27272a).
Dashboard Tables & Rows: Single horizontal row wrapper, 2px sharp end-caps, dark background (#09090b), 3px solid white border, hard 4px white offset shadow.
Badges & Tags: Rectangular tags with 2px solid white borders and solid neon Rose or Cyan fills.
Buttons & Toolbar Pills: Heavy rectangular buttons with 3px solid white borders, neon Rose (#f43f5e) or Cyan (#38bdf8) fills, hard 4px white offset shadows (4px 4px 0px #ffffff), and pure black text (#000000) for high contrast.
Click physics: Button depresses by 4px (transform: translate(4px, 4px)), flattening the offset shadow to 0px on click.
Micro-Graphics: 3 circular window header dots (red #ff5555, yellow #ffbd2e, green #27c93f) on card headers, thick white dividing lines.
Typography: Monospaced display font (Space Grotesk / Courier).

4. Maximalism (Dark Mode)
Background Canvas: 45-degree Electric Lime Green & Super Dark Black/Purple chevron wallpaper pattern (repeating-linear-gradient(45deg, #00ff44 0px, #00ff44 24px, #090514 24px, #090514 48px)).
App Header Bar: Deep Dark Purple (#130924), electric lime green logo text (#00ff44), 4px solid neon green bottom border (#00ff44).
Search Bar: Deep Dark Surface (#1c0d36), 4px corner radius, 4px solid neon green border (#00ff44), 6px solid magenta offset shadow (6px 6px 0px #d946ef).
Cards & Feed Containers: Deep dark containers (#1c0d36), 4px solid neon green borders (#00ff44), 6px solid magenta offset shadows (6px 6px 0px #d946ef), 4px border radius.
Dashboard Tables & Rows: Single horizontal row wrapper, 4px rounded end-caps, deep dark background, 4px solid neon green border, 6px solid magenta shadow.
Badges & Tags: High-contrast neon green outline badges with white text.
Buttons & Toolbar Pills: Neon Magenta action buttons (#e879f9) with pure black text (#000000), 4px solid neon green borders, scale boost on hover (transform: scale(1.03)).
Micro-Graphics: Neon green outline sponsor badges, giant display typography blocks.
Typography: Massive display font (Syne / Impact), bold all-caps display text.

5. Minimalism (Dark Mode)
Background Canvas: Deep Pitch Black canvas (#0a0a0a).
App Header Bar: Dark Charcoal (#121212), thin #262626 bottom border.
Search Bar: Dark Charcoal (#121212), 4px minimal border radius, ultra-thin 1px dark border (#262626), zero box-shadow (none).
Cards & Feed Containers: Dark Charcoal card containers (#121212), 4px minimal border radius, ultra-thin 1px dark border (#262626), zero box-shadow (none). Pure white text (#ffffff) for headlines, #888888 for body.
Dashboard Tables & Rows: Single horizontal row wrapper, 4px minimal end-caps, dark charcoal background, thin 1px #262626 border, zero shadow.
Badges & Tags: Minimal dark badges with thin gray borders and white text.
Buttons & Toolbar Pills: Minimal pure white pill buttons (#ffffff) with pure black text (#000000), zero shadow, thin crisp outline.
Micro-Graphics: Organic white pebble shapes, fine wireframe dark grid background lines.
Typography: Neutral lightweight sans-serif (Inter / Helvetica Neue) with generous whitespace.

6. Claymorphism (Dark Mode)
Background Canvas: Deep Indigo backdrop canvas (#1e1b4b).
App Header Bar: Dark Navy (#2e2a72), thin #4338ca bottom border.
Search Bar: 3D inflated deep indigo clay wrapper (#312e81), 28px inflated rounded corners, 3D dark clay glow effect (box-shadow: inset -5px -5px 10px rgba(0,0,0,0.5), inset 5px 5px 10px rgba(255,255,255,0.1), 10px 16px 28px rgba(0,0,0,0.6)).
Cards & Feed Containers: 3D inflated deep indigo clay cards (#312e81), 28px inflated rounded corners, signature dual top-left light inset highlight glow and bottom-right dark ambient drop shadow. Soft Ice Blue text (#e0e7ff).
Dashboard Tables & Rows: Single horizontal row wrapper, 28px inflated rounded end-caps, deep indigo clay background, 3D dark clay shadow glow.
Badges & Tags: Inflated dark clay pill badges with dark blue drop shadows.
Buttons & Toolbar Pills: 3D inflated bright blue clay action buttons (#818cf8), 30px pill radius, with top-left light inset highlight and white text (#ffffff).
Micro-Graphics: Friendly rounded badge pills, soft 3D floating icons.
Typography: Soft rounded sans-serif (Fredoka / Quicksand).

7. Skeumorphism (Dark Mode)
Background Canvas: Dark Steel Slate control panel surface (linear-gradient(180deg, #0f172a 0%, #1e293b 100%)).
App Header Bar: Metallic vertical dark gradient (linear-gradient(180deg, #1e293b 0%, #0f172a 100%)), #334155 bottom border.
Search Bar: Dark metallic gradient container (linear-gradient(180deg, #1e293b 0%, #0f172a 100%)), 10px border radius, #334155 border, inset top white bevel highlight (inset 0 1px 0 rgba(255,255,255,0.15)).
Cards & Feed Containers: Dark metallic slate card containers (linear-gradient(180deg, #1e293b 0%, #0f172a 100%)), 10px border radius, #334155 border, beveled inset panel highlights and tactile dark drop-shadow (box-shadow: 0 3px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.4)). Bright silver-white text (#f8fafc).
Dashboard Tables & Rows: Single horizontal row wrapper, 10px beveled end-caps, dark metallic gradient fill, inset top white bevel highlight.
Badges & Tags: Metallic dark badges with debossed borders and light slate text.
Buttons & Toolbar Pills: Convex dark blue metallic action buttons (linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)), top white bevel highlight, debossed border ring, with white text (#ffffff).
Micro-Graphics: Debossed panel tracks, rotary dial tick marks, LED status dots (green #10b981, red #ef4444).
Typography: Industrial serif (Georgia / Cinzel).

8. Neomorphism (Dark Mode)
Background Canvas: Monochromatic Dark Slate Plastic canvas (#1a202c).
App Header Bar: Soft dark slate (#1a202c), zero bottom border.
Search Bar: Soft dark slate inset field (#1a202c), inset neomorphic dark shadow (box-shadow: inset 6px 6px 10px #12161f, inset -6px -6px 10px #222a39), 20px rounded corners, zero border.
Cards & Feed Containers: Soft dark plastic card containers sharing the exact same #1a202c color as the background canvas (border: none), neomorphic outset dark soft dual shadows (box-shadow: 8px 8px 16px #12161f, -8px -8px 16px #222a39), 20px smooth rounded corners. Soft slate white text (#edf2f7).
Dashboard Tables & Rows: Single horizontal row wrapper, 20px rounded plastic end-caps, dark slate #1a202c background, extruded neomorphic dual shadows.
Badges & Tags: Extruded dark slate pill badges with sky blue text (#63b3ed).
Buttons & Toolbar Pills: Soft extruded dark plastic action buttons (#1a202c fill) with bright sky blue accent text (#63b3ed) and neomorphic dark outset shadows (6px 6px 12px #12161f, -6px -6px 12px #222a39).
Micro-Graphics: Soft circular toggle dots, pressed inset input slots.
Typography: Clean soft sans-serif (Nunito / Poppins).

### Change 23: Header Icon Contrast Fix for Maximalism & All Themes
* **Goal**: I wanted to ensure that header navigation buttons (back button, home button, hamburger menu icon) remain brightly visible across all themes, specifically fixing Maximalism where black icons previously blended into the black header background.
* **Actions**:
  * Added base `.app-header` button contrast inheritance rules in [index.css](file:///c:/Users/jai18/Desktop/link-archive-app/frontend/src/index.css) so header buttons and SVGs inherit the active header text color (`color: inherit !important; stroke: currentColor !important`).
  * Added explicit rules for Maximalism theme in Light and Dark modes (`.theme-maximalism .app-header button`, `.theme-maximalism .app-header svg`) setting text and stroke color to electric lime green (`#00ff44 !important`) against the black header background (`#000000`).
  * Tested production compilation (`npx vite build` succeeded in 117ms with 36 modules transformed).
