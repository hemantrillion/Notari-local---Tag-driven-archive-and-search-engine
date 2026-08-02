# Notari (local) - Frontend Architecture & Change Log

**Repository**: [https://github.com/hemantrillion/Notari-local---Tag-driven-archive-and-search-engine](https://github.com/hemantrillion/Notari-local---Tag-driven-archive-and-search-engine)

---

## 1. App Header & Global Navigation
* **`ham` / `ham icon`**: Hamburger 3-line menu icon located at top-left. Opens the floating sidebar navigation drawer.
* **`alback`**: Back button located at top-left next to `ham`. Navigates back to the previous screen/view.
* **`home`**: Home button located at top-left header. Direct shortcut back to the main homepage.

---

## 2. Sidebar Navigation Drawer
* **Top Home Item**: Navigation item to return to the homepage.
* **Tagged Dashboard**: Dashboard listing all links that have been assigned one or more tags.
* **Untagged Dashboard**: Dashboard listing all raw links captured without tags (assigned default tag code `0000`).
* **Tags Registry**: Manages all tag entries created via Tag Editor or manually.
* **Sources Registry**: Manages origin platform entries (Instagram, Telegram, YouTube, etc.) created automatically upon sharing or manually.
* **Themes Dashboard**: View for customizing UI appearance and themes.
* **`[Currently stable - don't touch]` Logs Dashboard**: Dual sub-tabs (*Change Logs* & *Audit Logs*) recording all system activities.
* **`triple t`**: Bottom sidebar bar containing 3 icons and empty rounded squares. First icon toggles light/dark mode (currently shows click animation). Squares reserved for future features.

---

## 3. Simulated Mobile Frame (Left Side Testing Area)
* **`WebsiteFrontendPlayground`**: Embedded phone simulation on the left side of desktop interface. Allows searching YouTube and simulating share intents that trigger native `Tag Now` / `Tag Later` dialogs.

---

## 4. Homepage & Search Engine
* **Central Search Box**: Primary tag-driven search input on the homepage. Automatically joins/separates queried tags with fixed `|` delimiter.
* **Recents Section**: Located below the search box, displaying the last 10–20 tagged Webpages/Websites.

---

## 5. SERP (Search Engine Results Page)
* **SERP View**: Landed upon submitting a tag query from the search box.
* **All Tab**: Displays all Webpages/Websites matching the searched tag or tag combination.
* **Images Tab**: Displays image assets extracted from matching Webpages, inheriting page tags.
* **Videos Tab**: Displays video assets extracted from matching Webpages, inheriting page tags.

---

## 6. Webpage / Website View & In-App Media Player
* **`WebsiteDetailView`**: Rendered HTML version of a saved link (termed **Webpage** or **Website**). Supports custom themes, fonts, display settings, and editing.
* **`MediaPlayerModal` (Play Button)**: Embedded player accessible via Play buttons on Tagged dashboard, Untagged dashboard, and Webpage views. Plays videos, images, or media directly inside the app.

---

## 7. Tag Editor & Word Editor
* **`WordEditor`**: Rich-text editor opened during `Tag Now` or Webpage edit mode. Allows setting Title, Tags, Source Code, Readable Code (`urlId`), and rich Body text.
