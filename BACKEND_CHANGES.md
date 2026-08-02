# Notari (local) - Backend Architecture & Replication Specification

**Repository**: [https://github.com/hemantrillion/Notari-local---Tag-driven-archive-and-search-engine](https://github.com/hemantrillion/Notari-local---Tag-driven-archive-and-search-engine)

---

## 1. Project Directory & Backend File Structure

```text
c:\Users\jai18\Desktop\link-archive-app\backend\
├── package.json                          # Backend dependencies (Express, CORS, Prisma, etc.)
├── links.json                            # Local JSON database persistent file
├── links.repository.js                   # Legacy database access helper
├── prisma.config.ts                      # Prisma client setup file
├── prisma/
│   └── schema.prisma                     # SQLite/Database schema definition
└── src/
    ├── server.js                         # Server entrypoint mounting Express routes on port 5005
    ├── shared/
    │   └── db.js                         # Persistent JSON DB reader/writer (readDb, writeDb)
    └── modules/
        ├── links/                        # Links management module
        │   ├── links.routes.js           # Router mapping /api/links endpoints
        │   ├── links.controller.js       # HTTP request handlers for link CRUD operations
        │   ├── links.service.js          # Core business logic, urlId generator & tag mapper
        │   └── links.repository.js       # Persistence queries for links
        ├── tags/                         # Tag registry module
        │   ├── tags.routes.js            # Router mapping /api/tags endpoints
        │   ├── tags.controller.js       # HTTP request handlers for tags
        │   ├── tags.service.js           # Business logic for tag codes (0000 untagged)
        │   └── tags.repository.js       # Persistence queries for tags
        ├── sources/                      # Origin sources module (Instagram, YouTube, etc.)
        │   ├── sources.routes.js         # Router mapping /api/sources endpoints
        │   ├── sources.controller.js     # Request handlers for sources
        │   └── sources.service.js        # Source platform code resolver (ytb, ins, gfg, git, web)
        ├── search/                       # Tag search engine module
        │   ├── search.routes.js          # Router mapping /api/search endpoints
        │   ├── search.controller.js     # Request handler for tag query searches
        │   └── search.service.js         # Multi-tag combo filtering logic (| delimiter)
        ├── audit-logs/                   # [Currently stable - don't touch] Audit logs module
        │   ├── audit-logs.routes.js      # Router mapping /api/audit-logs endpoints
        │   ├── audit-logs.controller.js  # Request handler returning system activity logs
        │   └── audit-logs.service.js     # Audit log recorder (createAuditLog, getAuditLogs)
        ├── youtube/                      # YouTube search proxy API module
        │   └── youtube.routes.js         # Route querying external YouTube API
        └── proxy/                        # Web page content proxy module
            └── proxy.routes.js           # Route fetching HTML previews for Webpage Detail View
```

---

## 2. Persistent Database Schema (`links.json` & `shared/db.js`)

* **Database Persistence File**: [backend/links.json](file:///c:/Users/jai18/Desktop/link-archive-app/backend/links.json)
* **File Reader & Writer**: [backend/src/shared/db.js:L6-L54](file:///c:/Users/jai18/Desktop/link-archive-app/backend/src/shared/db.js#L6-L54)
* **Schema Contract Structure**:

```json
{
  "links": [
    {
      "id": "uuid-v4-string",
      "url": "https://www.youtube.com/watch?v=example",
      "readableCode": "ytb-vid-0001-01-0826-000",
      "sourceCode": "ytb",
      "typeCode": "vid",
      "primaryTag": "0001",
      "tagLabel": "programming",
      "tags": [
        { "code": "0001", "label": "programming" }
      ],
      "from": "youtube",
      "notes": "<p>Rich text notes content</p>",
      "title": "Example Video Page",
      "createdAt": "2026-08-01T09:20:00.000Z",
      "updatedAt": "2026-08-01T09:20:00.000Z"
    }
  ],
  "tagRegistry": [
    { "code": "0000", "label": "untagged" },
    { "code": "0001", "label": "programming" }
  ],
  "sourceRegistry": [
    { "code": "ytb", "name": "youtube", "url": "youtube.com" },
    { "code": "ins", "name": "instagram", "url": "instagram.com" },
    { "code": "gfg", "name": "geeksforgeeks", "url": "geeksforgeeks.org" },
    { "code": "git", "name": "github", "url": "github.com" },
    { "code": "web", "name": "web", "url": "" }
  ],
  "auditLogs": [
    {
      "id": "log-mcw72f80b",
      "action": "CREATE_LINK",
      "details": "Link 'Example Video Page' (https://...) was shared.",
      "timestamp": "2026-08-01T09:20:00.000Z"
    }
  ]
}
```

---

## 3. Technical Specification of `urlId` (`readableCode`)

* **File Location**: [backend/src/modules/links/links.service.js:L103-L124](file:///c:/Users/jai18/Desktop/link-archive-app/backend/src/modules/links/links.service.js#L103-L124)
* **Function**: `computeUniqueReadableCode(sourceCode, tagCode, typeCode, existingLinks)`
* **Format Regex**: `/^[a-z]{3}-[a-z]{3}-[a-z0-9]{4}-\d{2}-\d{4}-\d{3}$/`
* **Constructed Pattern**: `{sourceCode}-{typeCode}-{tagCode}-{DD}-{MMYY}-{suffix}`

### Step-by-Step Field Derivation:
1. **`sourceCode` (3 Characters)**: Resolved from origin URL via heuristic matching (`ytb` for YouTube, `ins` for Instagram, `gfg` for GeeksForGeeks, `git` for GitHub, `web` for generic web).
2. **`typeCode` (3 Characters)**: Content heuristic (`vid` for videos/reels/shorts, `img` for posts/images, `doc` for articles/documents).
3. **`tagCode` (4 Characters)**: 4-character code assigned to the primary tag. **Untagged items default strictly to `0000`**.
4. **`DD` (2 Digits)**: 2-digit day of creation month (e.g. `01`, `02`).
5. **`MMYY` (4 Digits)**: 2-digit month and 2-digit year (e.g. `0826` for August 2026).
6. **`suffix` (3 Digits)**: Sequential 3-digit daily link counter (`000`, `001`, `002`), computed by counting links created on the same calendar day.

---

## 4. Complete API Endpoints & Service Logic

### 4.1 Links API Module
* **Router File**: [backend/src/modules/links/links.routes.js](file:///c:/Users/jai18/Desktop/link-archive-app/backend/src/modules/links/links.routes.js)
* **Controller File**: [backend/src/modules/links/links.controller.js](file:///c:/Users/jai18/Desktop/link-archive-app/backend/src/modules/links/links.controller.js)
* **Service File**: [backend/src/modules/links/links.service.js](file:///c:/Users/jai18/Desktop/link-archive-app/backend/src/modules/links/links.service.js)

| HTTP Method | Route Endpoint | Controller Handler | Service Logic & Description |
| :--- | :--- | :--- | :--- |
| **`GET`** | `/api/links` | `getLinks` (`L4-L12`) | Fetches all stored link records from `links.json`. Optional query `?tagged=true` filters links with `primaryTag !== '0000'`. |
| **`POST`** | `/api/links` | `createLink` (`L14-L25`) | Intercepts shared URL. Runs URL heuristics (`L29-L93`), generates `readableCode` (`L103-L124`), assigns tag `0000` if untagged (`Tag Later`), saves record, triggers audit log. |
| **`PUT`** | `/api/links/:id` | `updateLink` (`L27-L45`) | Updates link title, primary tag, tag array, rich-text body notes, and custom `readableCode` (`urlId`). Triggers audit log update entry. |
| **`DELETE`**| `/api/links/:id` | `deleteLink` (`L47-L55`) | Removes link record by UUID and logs deletion in audit logs. |

---

### 4.2 Tag-Driven Search Engine API Module
* **Router File**: [backend/src/modules/search/search.routes.js](file:///c:/Users/jai18/Desktop/link-archive-app/backend/src/modules/search/search.routes.js)
* **Controller File**: [backend/src/modules/search/search.controller.js](file:///c:/Users/jai18/Desktop/link-archive-app/backend/src/modules/search/search.controller.js)
* **Service File**: [backend/src/modules/search/search.service.js](file:///c:/Users/jai18/Desktop/link-archive-app/backend/src/modules/search/search.service.js)

* **Endpoint**: `GET /api/search?q=tag1|tag2`
* **Query Logic** (`search.service.js#L1-L45`):
  1. Receives raw query string `q`.
  2. Splits query by `|` delimiter into tag tokens (e.g. `['programming', 'javascript']`).
  3. Filters all links in `links.json` where link tags or title match all or any of the target tag tokens.
  4. Returns JSON array of matching Webpages/Websites to render in SERP view.

---

### 4.3 `[Currently stable - don't touch]` Audit Logs Module
* **Router File**: [backend/src/modules/audit-logs/audit-logs.routes.js](file:///c:/Users/jai18/Desktop/link-archive-app/backend/src/modules/audit-logs/audit-logs.routes.js)
* **Controller File**: [backend/src/modules/audit-logs/audit-logs.controller.js](file:///c:/Users/jai18/Desktop/link-archive-app/backend/src/modules/audit-logs/audit-logs.controller.js)
* **Service File**: [backend/src/modules/audit-logs/audit-logs.service.js](file:///c:/Users/jai18/Desktop/link-archive-app/backend/src/modules/audit-logs/audit-logs.service.js)

* **Endpoint**: `GET /api/audit-logs`
* **Functionality**:
  * Returns array of audit objects (`id`, `action`, `details`, `timestamp`).
  * `createAuditLog(action, details)` automatically appends new system events to the front of the `auditLogs` array in `links.json`.

---

### 4.4 Tags & Sources Registry API Modules
* **Tags Endpoint**: `GET /api/tags`, `POST /api/tags`, `PUT /api/tags/:code`, `DELETE /api/tags/:code`
  * Manages code-to-label tag mappings stored in `tagRegistry`.
* **Sources Endpoint**: `GET /api/sources`, `POST /api/sources`, `PUT /api/sources/:code`, `DELETE /api/sources/:code`
  * Manages platform source registries (`ytb`, `ins`, `gfg`, `git`, `web`) stored in `sourceRegistry`.
