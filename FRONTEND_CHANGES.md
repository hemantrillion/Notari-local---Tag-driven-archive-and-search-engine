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
