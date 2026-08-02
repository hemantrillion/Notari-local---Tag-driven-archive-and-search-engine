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

* **`ham` / `ham icon`**: The 3-line hamburger menu icon at the top-left of the header. Toggles the sidebar drawer.
* **`alback`**: Top-left back button icon next to `ham`. Navigates to the previous view.
* **`home`**: Top-left home button icon. Returns directly to the main homepage.
* **`triple t`**: The bottom bar of the sidebar drawer containing 3 action icons and reserved rounded square slots. The first icon toggles light/dark theme.
* **`SERP`**: Search Engine Results Page, displaying filtered query results under `All`, `Images`, and `Videos` tabs.
* **`Webpage` / `Website`**: The formatted HTML page generated when a saved link is viewed or customized.
* **`Tag Now`**: Share dialog option that immediately opens the Tag Editor (`WordEditor.jsx`).
* **`Tag Later`**: Share dialog option that saves the link directly to the Untagged Dashboard with default tag code `0000`.

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

