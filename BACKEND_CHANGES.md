# Notari (local) - Backend Architecture & Change Log

**Repository**: [https://github.com/hemantrillion/Notari-local---Tag-driven-archive-and-search-engine](https://github.com/hemantrillion/Notari-local---Tag-driven-archive-and-search-engine)

---

## 1. Server Architecture & Routing
* **`server.js`**: Express application server running on port 5005. Configured with CORS, JSON body parsers, and modular API route controllers (`/api/links`, `/api/tags`, `/api/sources`, `/api/search`, `/api/audit-logs`, `/api/youtube`, `/api/proxy`).

---

## 2. Database Storage & URL ID (`readableCode`)
* **`links.json` & `db.js`**: Local database storage holding `links`, `tagRegistry`, `sourceRegistry`, and `auditLogs` arrays.
* **URL ID (`urlId` / `readableCode`)**: Unique readable identifier generated from link metadata (source, tag, creation timestamp). Untagged links default to tag code `0000`.

---

## 3. Backend Services & Modules
* **`links.service.js`**: Core service handling link creation from share intent, tag updates, untagged queue, and Webpage content storage.
* **`tags.service.js`**: Service managing tag creation, renaming, code assignment, and deletion.
* **`sources.service.js`**: Service managing origin platforms (Instagram, Telegram, YouTube, etc.).
* **`search.service.js`**: Query engine filtering saved Webpages by single or multi-tag combinations.
* **`[Currently stable - don't touch]` `audit-logs.service.js`**: Service recording all CRUD operations into `auditLogs` array with timestamps and field-level diffs.
* **`proxy.routes.js` & `youtube.routes.js`**: Backend routes fetching external web page previews and YouTube search API data.
