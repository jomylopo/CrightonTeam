# Shana Gates — Project Rules

## What This Project Is
A branded real estate website for **Shana Gates**, agent at Craft & Bauer | Real Broker. The site targets buyers and sellers in the **Coachella Valley, CA** market. It is a **static HTML site** deployed to Vercel via GitHub auto-deploy.

- **Live site**: `https://shana-gates.vercel.app`
- **GitHub**: `kiwi-vegas/Shana-Gates` (push to `main` → auto-deploys)
- **Deployment**: Always commit + push to GitHub after any changes. Vercel deploys automatically.

---

## Site Structure

```
index.html              ← Homepage
palm-springs.html       ← Community page
palm-desert.html
rancho-mirage.html
indian-wells.html
la-quinta.html
indio.html
cathedral-city.html
desert-hot-springs.html
coachella.html
community.css           ← Shared styles for all community pages
images/                 ← All site images including avatars/grid.jpg
admin/assistant/        ← AI Content Assistant UI
  login.html
  setup.html            ← Avatar & name picker (first login)
  index.html            ← Chat UI
admin/blog-picker/      ← Daily blog article picker (auth-gated)
  index.html
admin/weekly-picker/    ← Weekly original content picker (auth-gated)
  index.html
admin/va-queue/         ← Media Queue (VA review): thumbnail, captions, video, publish/schedule
  index.html            ← Queue listing (pending / ready / scheduled posts)
  editor.html           ← Per-post editor — tabbed per-platform captions + WHEN TO PUBLISH panel
admin/admin-nav.js      ← Top admin nav — mirrors Legacy Home Search IA
                          (PIPELINE: Idea Review, Media Queue, Analytics)
api/assistant/          ← Serverless API routes (Vercel)
  auth.ts               ← HMAC login/logout
  chat.ts               ← Claude agentic tool loop
api/cron/               ← Vercel cron jobs
  research.ts           ← Daily 6AM research + digest email
  weekly.ts             ← Saturday 8PM weekly topic generation
  publish-scheduled.ts  ← Every 15min — publishes posts whose scheduledPublishAt is due
api/blog/               ← Blog publish + data endpoints
  publish.ts            ← Publish selected daily articles
  publish-weekly.ts     ← Publish selected weekly topics
  articles.ts           ← GET stored daily articles from Redis
  weekly-topics.ts      ← GET stored weekly topics from Redis
  queue-mark-ready.ts   ← Save VA edits (incl. per-platform captions) + set media_ready
  queue-publish.ts      ← Publish post live + remove from queue
  queue-schedule.ts     ← POST schedules for future publish, DELETE cancels
  generate-platform-captions.ts ← One-call generation of all 7 platform captions
api/content/            ← Video pipeline endpoints
  generate-script.ts    ← AI video script (Shana voice, CV market)
  generate-heygen-video.ts ← Submit to HeyGen, returns videoId
  heygen-status.ts      ← Poll HeyGen render; saves to Vercel Blob on complete
  upload-token.ts       ← Vercel Blob client upload token for browser XHR
  publish-video.ts      ← Publish video to all 7 Blotato social platforms
  blotato-status.ts     ← Poll Blotato post submission status
blog/                   ← Public blog pages
  index.html            ← Blog listing (fetches from Redis via API)
  post.html             ← Individual post (reads ?slug= param)
lib/
  sanity.ts             ← Sanity client (community overrides only)
  assistant-tools.ts    ← Tool definitions + Sanity read/write
  research.ts           ← Tavily + Claude Opus article scoring
  weekly-research.ts    ← Claude topic generation per category
  writer.ts             ← Claude Sonnet blog post writer (Shana voice)
  blog-image-gen.ts     ← Gemini image generation (CV visual anchors)
  blog-images.ts        ← Full image fallback chain
  blog-email.ts         ← Resend email: daily digest + Sunday digest
  blog-store.ts         ← Upstash Redis: article/topic cache
  blog-redis.ts         ← Blog queue read/write (posts, queue, index, community overrides)
  blog-sanity.ts        ← Publish blogPost documents to Sanity (legacy — blog now uses Redis)
  heygen-client.ts      ← HeyGen API: generateHeyGenVideo, getHeyGenVideoStatus
  blotato-client.ts     ← Blotato API: all 7 platform publish functions
  publish-service.ts    ← Caption builders, CV hashtags, generatePlatformCaptions
BLOG.md                 ← Full blog system specification
COMMUNITIES.md          ← Community-page anatomy + replication guide
MAPS.md                 ← Full maps system specification
VA-QUEUE.md             ← Full VA queue + video pipeline specification
community-map.js        ← Shared Mapbox init for all 9 community pages
```

---

## Client Details

- **Client**: Shana Gates
- **Brokerage**: Craft & Bauer | Real Broker
- **Market**: Coachella Valley, CA
- **YLOPO search domain**: `search.searchcoachellavalleyhomes.com`
- **Contact**: `shana@craftbauer.com`

---

## YLOPO Widget System

### How It Works
YLOPO provides embeddable JavaScript widgets that pull live MLS listings. Every community page uses two pieces:

**1. Script config** — in `<head>`:
```html
<script>
  var YLOPO_HOSTNAME = 'search.searchcoachellavalleyhomes.com';
  window.YLOPO_WIDGETS = { domain: 'search.searchcoachellavalleyhomes.com' };
</script>
```

**2. Gallery div** — where listings should appear:
```html
<div class="YLOPO_resultsWidget" data-search='{"locations":[{"city":"Palm Springs","state":"CA"}],"propertyTypes":["house","condo","townhouse"],"limit":12}'></div>
```

**3. Widget script** — before `</body>`:
```html
<script src="https://search.searchcoachellavalleyhomes.com/build/js/widgets-1.0.0.js" defer></script>
```

### Gallery `data-search` Parameters

| Field | Values | Notes |
|---|---|---|
| `locations` | array of location objects | See formats below |
| `minPrice` | number | e.g. `500000` for $500K |
| `maxPrice` | number | omit for no max |
| `propertyTypes` | `"house"`, `"condo"`, `"townhouse"`, `"manufactured"`, `"multi_family"`, `"land"` | default: all three standard types |
| `status` | `"active"`, `"sold"` | default: `"active"` |
| `limit` | number | **always use `12`** |

### Location Formats

**By city** (all Coachella Valley communities are incorporated cities):
```json
{ "city": "Palm Springs", "state": "CA" }
```

### Listing Limit — ALWAYS 12

Every community page must use `"limit":12`. Users click "View All" to see full results on the YLOPO search site.

### View All URL Format
```
https://search.searchcoachellavalleyhomes.com/search?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Palm+Springs&s[locations][0][state]=CA
```

### Deployment Note
The YLOPO widget only renders on domains registered in Shana's YLOPO account. It will not render on `localhost` — the page layout will appear correctly but the listing grid will be empty. This is expected.

---

## Community Pages

All 9 Coachella Valley cities are covered. Each community page (`*.html`) uses `community.css` for shared styles.

| Page | File | YLOPO city param | Search URL |
|---|---|---|---|
| Palm Springs | `palm-springs.html` | `Palm Springs` | `city=Palm+Springs` |
| Palm Desert | `palm-desert.html` | `Palm Desert` | `city=Palm+Desert` |
| Rancho Mirage | `rancho-mirage.html` | `Rancho Mirage` | `city=Rancho+Mirage` |
| Indian Wells | `indian-wells.html` | `Indian Wells` | `city=Indian+Wells` |
| La Quinta | `la-quinta.html` | `La Quinta` | `city=La+Quinta` |
| Indio | `indio.html` | `Indio` | `city=Indio` |
| Cathedral City | `cathedral-city.html` | `Cathedral City` | `city=Cathedral+City` |
| Desert Hot Springs | `desert-hot-springs.html` | `Desert Hot Springs` | `city=Desert+Hot+Springs` |
| Coachella | `coachella.html` | `Coachella` | `city=Coachella` |

All Coachella Valley communities are **incorporated cities** — always use `"city": "NAME"`, never `"community"`.

### Community Page Structure
Each page includes:
1. Nav — logo + links + contact CTA (Communities dropdown links to all 9 city pages)
2. Hero — city name + hero stats (active listings, median price, property types)
3. Mapbox 3D hero map (Standard style / night preset, pitch 45°, non-interactive)
4. YLOPO listings widget (limit: 12) + "View All" button
5. Overview section with Quick Facts sidebar
6. Highlights grid
7. Lifestyle section
8. Schools section
9. FAQ section
10. CTA section
11. Footer with MLS disclosure

### Community Page Quick Fact Keys
Each page has editable quick facts. Keys vary slightly per page:

| Page | Quick Fact Keys |
|---|---|
| Palm Springs | City Type, County, Population, Median Home Price, Architecture, Elevation, Airport, Drive to LA |
| Palm Desert | City Type, County, Population, Median Home Price, Known For, Elevation, Airport, Drive to LA |
| Rancho Mirage | City Type, County, Population, Median Home Price, Known For, Elevation, Airport, Drive to LA |
| Indian Wells | City Type, County, Population, Median Home Price, Known For, Elevation, Airport, Drive to LA |
| La Quinta | City Type, County, Population, Median Home Price, Known For, Golf Courses, Airport, Drive to LA |
| Indio | City Type, County, Population, Median Home Price, Known For, Elevation, Airport, Drive to LA |
| Cathedral City | City Type, County, Population, Median Home Price, Known For, Elevation, Airport, Drive to LA |
| Desert Hot Springs | City Type, County, Population, Median Home Price, Known For, Elevation, Airport, Drive to LA |
| Coachella | City Type, County, Population, Median Home Price, Known For, Elevation, Airport, Drive to LA |

---

## Homepage (`index.html`)

Key sections:
- **Hero** — full-screen with animated headline
- **Featured Properties** — 6 property cards linking to specific YLOPO listing detail pages
- **Communities grid** — flip cards for all 9 cities
- **About Shana** — bio with Watch Video modal (Vimeo player), "Work With Shana" CTA
- **Search listings** — YLOPO search widget
- **Footer**

### Featured Property Cards
Each card links to a specific listing URL at `search.searchcoachellavalleyhomes.com/search/detail/[id]`. Update hrefs with exact listing URLs when properties change.

### Watch Video Modal
The "Watch Video" button in the bio section opens a Vimeo modal (video ID `1178434432`). The modal:
- Autoplays on open
- Clears the iframe src on close (stops playback)
- Closes on X button, overlay click, or Escape key
- Works on mobile (16:9 aspect ratio maintained)

---

## Sanity CMS

Used for content that Shana updates via the AI Content Assistant. The public CDN is queried at runtime by each community page to apply overrides.

- **Project ID**: `ll3zy5cp`
- **Dataset**: `production`
- **Document type**: `communityPage`
- **Fields**: `slug`, `name`, `quickStats[]{ key, value }`, `heroImage`, `sectionImages[]{ role, image }`
- No Studio setup required — documents are created on first write via the assistant

### How Community Pages Use Sanity
Each community page has a script that:
1. Fetches the community doc from `ll3zy5cp.apicdn.sanity.io` at runtime (public CDN, no auth needed)
2. Matches stats by label text (`.hero-stat-label`, `.fact-label`)
3. Updates matching DOM values
4. Applies hero image if set

Falls back silently to hardcoded HTML values if no Sanity content exists for that page.

---

## AI Content Assistant

A chat-based interface at `/admin/assistant/` that lets Shana update site content in plain English. No CMS login required.

### Access
- **Login**: `https://shana-gates.vercel.app/admin/assistant/login.html`
- **Avatar setup**: `https://shana-gates.vercel.app/admin/assistant/setup.html` (first login)
- **Chat**: `https://shana-gates.vercel.app/admin/assistant/`
- **Password**: set via `ASSISTANT_PASSWORD` env var

### Avatar & Name Setup
On first login, Shana is directed to `setup.html` to pick one of 21 avatars (from `images/avatars/grid.jpg`, a 7×3 sprite sheet) and name her assistant. Saved to `localStorage` as `sg_avatar` (index 0–20) and `sg_name`. The ⚙️ button in the chat header returns to setup to change anytime.

### What Shana Can Update
- Any "At a Glance" stat on any community page (Median Home Price, Population, Drive to LA, etc.)
- Hero banner stats (Active Listings, Median Price)
- Page headlines and subheadlines
- Hero images and section images (attach in chat)
- Homepage text fields

### What It Cannot Do
- Delete pages, documents, or content
- Change CSS styles, colors, fonts, or layouts
- Modify navigation or YLOPO widget parameters
- Edit code or config files

### Architecture

```
login.html → setup.html (first time) → index.html (chat)
    │
    └── POST /api/assistant/chat
            │ Claude claude-opus-4-6
            │ tool_use loop (up to 10 iterations)
            │ lib/assistant-tools.ts — read/write tools
            │ lib/sanity.ts — Sanity CDN client
            └── Sanity CMS → DOM sync → live site
```

### Key Files

| File | Purpose |
|---|---|
| `api/assistant/auth.ts` | HMAC-signed cookie login (POST) + logout (DELETE) |
| `api/assistant/chat.ts` | Claude agentic tool loop, auth-gated |
| `lib/assistant-tools.ts` | Tool definitions + `executeToolCall()` — Sanity reads/writes |
| `lib/sanity.ts` | Sanity client setup |
| `admin/assistant/login.html` | Password login form |
| `admin/assistant/setup.html` | Avatar picker + name input (first-run setup) |
| `admin/assistant/index.html` | Chat UI with image upload, avatar display |

### Environment Variables (Vercel)

| Variable | Description |
|---|---|
| `SANITY_PROJECT_ID` | `ll3zy5cp` |
| `SANITY_DATASET` | `production` |
| `SANITY_WRITE_TOKEN` | Sanity Editor-role token |
| `ANTHROPIC_API_KEY` | Claude API key |
| `ASSISTANT_PASSWORD` | Shana's login password |
| `ADMIN_SECRET` | HMAC secret for session cookies |

---

## Maps

Full maps documentation is in **`MAPS.md`**. Summary:

- **Library**: Mapbox GL JS v3.4.0 — Standard style with `night` light preset
- **Token**: public token in `community-map.js` and `index.html` (safe to commit)
- **Community pages**: each page sets `window.CV_MAP_CONFIG` then loads `/community-map.js`
  - Hero map: pitch 45°, non-interactive, Standard/night
  - Lifestyle map: pitch 52°, interactive + NavigationControl, lazy-loaded
  - Both show: city boundary polygon, I-10 (blue), Hwy 111 (bronze), POI markers
- **Homepage**: inline valley overview map in `index.html` — Standard/night, flat, all
  9 city boundaries clickable, I-10 + Hwy 111 road highlights, road legend

See `MAPS.md` for: full `CV_MAP_CONFIG` schema, all boundary polygons, POI lists,
CSS class reference, road waypoints, and ideas for future map features.

---

## Blog Content System

Two automated pipelines publish to `/blog`. Full details in `BLOG.md`.

**Pipeline 1 — Daily News** (6 AM PT daily)
- Tavily researches Coachella Valley news → Claude Opus scores top 10 → Shana gets digest email
- She picks 1–5 articles at `/admin/blog-picker/`
- Claude Sonnet writes full posts, Gemini generates hero images → queued in Redis (`media_pending`)

**Pipeline 2 — Weekly Original Content** (Saturday 8 PM PT)
- Claude generates 2–3 topic ideas per category (5 categories = ~10–15 ideas) → Sunday email
- Shana picks topics at `/admin/weekly-picker/` (organized by category tabs)
- Claude writes full posts, images generated → queued in Redis (`media_pending`)

**Note:** Posts are stored in **Upstash Redis** (not Sanity) and go through the VA Queue before publishing. The blog listing page reads from Redis via API. Full VA queue + video pipeline details in `VA-QUEUE.md`.

### Blog + VA Queue URLs
- **Blog listing**: `/blog/`
- **Individual post**: `/blog/post.html?slug=...`
- **Daily picker**: `/admin/blog-picker/`
- **Weekly picker**: `/admin/weekly-picker/`
- **VA Queue**: `/admin/va-queue/` — review thumbnail, caption, video script, publish live + social

### VA Queue Workflow
```
Blog picker publishes → media_pending (Redis queue)
  → VA opens editor.html → uploads thumbnail, edits caption, generates video script
  → (optional) generates HeyGen base video, edits, uploads final video
  → clicks "Mark as Ready" → media_ready
  → Shana clicks "Publish" → live on blog + video pushed to 7 social platforms via Blotato
```

### Additional Environment Variables Needed
| Variable | Purpose |
|---|---|
| `TAVILY_API_KEY` | Article + topic research |
| `UPSTASH_REDIS_REST_URL` | Article/topic cache + blog post storage |
| `UPSTASH_REDIS_REST_TOKEN` | Redis auth |
| `RESEND_API_KEY` | Email delivery |
| `FROM_EMAIL` | Sender address |
| `OPERATOR_EMAIL` | Shana's digest email |
| `GOOGLE_API_KEY` | Gemini image generation |
| `OPENAI_API_KEY` | DALL-E 3 fallback |
| `CRON_SECRET` | Vercel cron auth |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob — thumbnails + video storage |
| `HEYGEN_API_KEY` | HeyGen video generation (Agent key type) |
| `HEYGEN_AVATAR_LOOK_ID` | HeyGen avatar look ID |
| `HEYGEN_VOICE_ID` | HeyGen voice ID |
| `BLOTATO_API_KEY` | Blotato social publishing |
| `BLOTATO_FACEBOOK_ACCOUNT_ID` | Blotato Facebook account |
| `BLOTATO_FACEBOOK_PAGE_ID` | Facebook page ID |
| `BLOTATO_YOUTUBE_ACCOUNT_ID` | Blotato YouTube account |
| `BLOTATO_TIKTOK_ACCOUNT_ID` | Blotato TikTok account |
| `BLOTATO_LINKEDIN_ACCOUNT_ID` | Blotato LinkedIn account |
| `BLOTATO_X_ACCOUNT_ID` | Blotato X/Twitter account |
| `BLOTATO_THREADS_ACCOUNT_ID` | Blotato Threads account |
| `BLOTATO_INSTAGRAM_ACCOUNT_ID` | Blotato Instagram account |

---

## Behind the Gates — Gated Community System

### Overview
The "Behind the Gates" section is a full guide to gated communities in the Coachella Valley. It consists of:
- **Hub page**: `behind-the-gates.html` — lists all communities as cards with satellite/photo thumbnails
- **Detail pages**: `gated/{slug}.html` — generated from `gated/_template.html` via sed
- **Data**: `data/gated-communities.json` — all community content (descriptions, stats, amenities, etc.)

### Current Status (as of May 2026)
- **60 communities** in the JSON
- **21 have `hasDetailPage: true`** (live pages): pga-west, the-madison-club, the-vintage-club, bighorn-golf-club, mission-hills-country-club, sun-city-palm-desert, sun-city-shadow-hills, cotino, trilogy-la-quinta, del-webb-rancho-mirage, toscana-country-club (Batch 1) + hideaway-golf-club, the-springs-country-club, desert-princess-country-club, oasis-country-club, heritage-palms, four-seasons-terra-lago, trilogy-polo-club, andalusia-coral-mountain, rio-del-sol, bermuda-dunes (Batch 2)
- **39 remaining** with `hasDetailPage: false` — to be published in batches of 10/day

### Batch Publishing Workflow
1. Pick next 10 slugs with `hasDetailPage: false` from the JSON
2. Generate HTML: `cd gated && for f in slug1 slug2 ...; do sed "s/__SLUG__/$f/g; s/__COMMUNITY_NAME__/$f/g" _template.html > "$f.html"; done`
3. Set `hasDetailPage: true` for those 10 in the JSON (use Python script)
4. Add 10 URLs to `sitemap.xml`
5. `git add` + `git commit` + `git push` → Vercel auto-deploys

User triggers each batch by asking: **"publish the next 10 gated pages."**

### Image Folder Convention
Photos for each community go in `/images/gated/{slug}/` — use the exact slug from the URL.

| Filename | Use |
|---|---|
| `hero.jpg` (or `.jpeg`, `.png`) | Card thumbnail on hub + fallback for detail page hero |
| `hero-shana.png` | Branded "Welcome to X" shot with Shana — detail page hero background (set `heroPageImage` in JSON) |

**The site picks up images automatically — no code change needed.** The layered CSS approach shows real photo over satellite map; satellite is the fallback when no photo exists.

Empty `.gitkeep` files exist in all 60 community dirs so the client can drop photos into any folder immediately.

### JSON Schema — key fields
```json
{
  "slug": "community-name",
  "hasDetailPage": false,           // true = live page exists
  "heroImage": "/images/gated/{slug}/hero.jpg",
  "heroPageImage": "/images/gated/{slug}/hero-shana.png",  // optional
  "officialWebsite": "https://...", // official club/community site
  "hoaWebsite": "https://...",      // HOA management company
  "cityWebsite": "https://...",     // city government site
  "lat": 33.0000,
  "lng": -116.0000
}
```

The `officialWebsite`, `hoaWebsite`, and `cityWebsite` fields render as an "Official Resources" sidebar block on detail pages (links open in new tab).

### Template
`gated/_template.html` — all detail pages are generated from this. When the template changes, regenerate all live pages via the sed command above. The template populates all content dynamically from the JSON via `window.GATED_SLUG`.

---

## Property Reports — `/property-report.html`

Public lead-gen tool that lets any visitor request an AI-generated property report by address. No login. Email-PDF delivery via Resend. The visitor picks one or both reports via checkboxes:

| Report | Endpoint | Spec |
|---|---|---|
| **Buyers Analysis** | `api/property-report.ts` | [BUYERS-REPORT.md](BUYERS-REPORT.md) — comps, cash flow, neighborhood, investment, market, 6-page PDF |
| **Property History** | `api/property-history.ts` | [HISTORY-REPORT.md](HISTORY-REPORT.md) — construction, ownership, permits, public records, 5-page PDF |

Both pipelines run in parallel when both checked. They share `api/property-report-send.ts` — pass `pdfBase64` (analysis), `historyPdfBase64` (history), or both. Subject line and body adapt to which reports were attached. Both have `maxDuration: 300` in `vercel.json`.

The history report is meant for a buyer on the way to view a property — quick public-record context (year built, architect, owners, permits, STR history, historic designation, notable residents, public events) compiled from Tavily searches and constrained by a strict system prompt to avoid hallucination. Includes a §1710.2 / Fair Housing disclaimer block.

---

## Admin UX — Mirrors Legacy Home Search

The admin interface is being refactored to match the IA of Barry Jenkins's site
(`legacy-home-search`) so the workflow has the same steps in the same order.

**Top nav structure (`admin/admin-nav.js`):**
- **PIPELINE** group: Idea Review, Media Queue, Analytics
- `● Live` indicator on the right
- The old Blog Picker / Weekly Picker / Strategic Picker / Blog Create / Blog
  Editor / Brand Guide / AI Assistant links were dropped from the top bar.
  Pages still exist at their URLs; they will be merged into Idea Review in a
  later phase (see "Phase plan" below).

**Per-post editor (`admin/va-queue/editor.html`):**
- "Social Captions" card has platform tabs (Facebook, LinkedIn, X, Threads,
  Instagram, YouTube, TikTok). One textarea, switches between platforms.
  "Generate All Captions" hits `/api/blog/generate-platform-captions`.
  Captions persist on the post as `post.captions: PlatformCaptions`.
- "WHEN TO PUBLISH" panel: Now / +1h / +2h / +4h / +8h / +12h / +1d / +2d / +3d.
  Selecting any non-Now option swaps the green **Publish** button for a teal
  **Schedule** button. Scheduled posts show a banner with "Cancel scheduled
  publish" instead of the delay row.
- Backward compat: if `post.captions` is empty, publish endpoints fall back to
  `post.socialCopy`, then to live caption generation.

**Workflow status state machine (`lib/blog-redis.ts`):**
```
media_pending → media_ready → published
                    ↓ schedule
                scheduled ─── (cron at scheduledPublishAt) ──→ published
                    ↓ cancel
                media_ready
```
The `/api/cron/publish-scheduled` cron (every 15 min) calls the same image /
video publish paths used by the manual Publish button.

**Idea Review consolidation (admin/idea-review/index.html):**
- Fetches both `/api/content/ideas` (scored idea candidates from
  `lib/idea-store.ts`) AND `/api/blog/articles` (daily Tavily news from
  `lib/blog-store.ts`) and renders them as one list.
- Each card carries a 📰 News / 💡 Idea source pill. News cards skip the
  score breakdown bars (single score) and show an external source link.
- News article approve/skip/defer status persists in `localStorage` under
  `sg_article_status` — server-side ideas keep their existing state machine.
- "Write & Publish" on a news article POSTs `/api/blog/publish` with a
  single `articleIds: [id]`; the post lands in Media Queue as `media_pending`.
- Header has a ✦ Generate Ideas button that calls
  `/api/blog/run-research?type=daily` (Tavily + Claude scoring + idea
  saving in one call) with a progress overlay.
- The old `/admin/blog-picker/`, `/admin/weekly-picker/`, and
  `/admin/strategic-picker/` pages still serve their HTML at their URLs,
  but they are no longer linked from the nav or the admin home pipeline.

**Phase plan (remaining work):**
1. ✅ Phase 1 (done): Nav reorg + editor (WHEN TO PUBLISH + per-platform captions)
2. ✅ Phase 2 (done): Blog Picker news merged into Idea Review + Generate
   Ideas button. Weekly + Strategic pickers still standalone — fold those
   in only if the user asks (their content shapes are different enough
   that batching wasn't a clean win).
3. Phase 3: Media Queue polish — monthly progress tracker, FH (Fair Housing)
   status badges if/when FH check is ported over.
4. Phase 4: Build `/admin/analytics/` with GA4-only metrics for now. Add
   YouTube / Facebook / TikTok later as those accounts are connected. The nav
   "Analytics" link currently points to the existing `/admin/blog-dashboard/`
   as a stopgap — repoint to `/admin/analytics/` when built.

The full replication guide for what Barry's admin looks like is in
`legacy-home-search/CONTENT_MACHINE_REPLICATION.md` (sibling project).

---

## Maintenance Instructions
After every significant change, update this file to reflect:
- New features or components added
- Decisions made and why
- Current status and what's next
- Any new conventions established
