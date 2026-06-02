# Branded Sites — Project Rules

## What This Project Is
Landing pages for real estate clients. Each page targets a specific community, city, or search (e.g. "Summerlin Homes For Sale", "Las Vegas Homes $200K+"). Property listings are powered by the **YLOPO** widget system embedded on the page.

---

## YLOPO Widget System

### How It Works
YLOPO provides embeddable JavaScript widgets that pull live MLS listings. There are two pieces:

**1. Script config** — tells the widget which YLOPO account/domain to pull data from:
```html
<script>
  var YLOPO_HOSTNAME = 'search.crightonrinalditeam.com';
  window.YLOPO_WIDGETS = { domain: 'search.crightonrinalditeam.com' };
</script>
```

**2. Gallery div** — defines what listings to show. Place this wherever the listings grid should appear:
```html
<div class="YLOPO_resultsWidget" data-search='{ ...search params... }'></div>
```

### Gallery `data-search` Parameters
```json
{
  "locations": [{ "city": "Las Vegas", "state": "NV" }],
  "minPrice": 200000,
  "maxPrice": 500000,
  "propertyTypes": ["house", "condo", "townhouse"],
  "status": "active"
}
```

| Field | Values | Notes |
|---|---|---|
| `locations` | array of location objects | See location formats below |
| `minPrice` | number | e.g. `200000` for $200K |
| `maxPrice` | number | omit for no max |
| `propertyTypes` | `"house"`, `"condo"`, `"townhouse"`, `"manufactured"`, `"multi_family"`, `"land"` | array, include all relevant types |
| `status` | `"active"`, `"sold"` | default to `"active"` |

### Location Formats

**By city:**
```json
{ "city": "Las Vegas", "state": "NV" }
```

**By neighborhood/community:**
```json
{ "neighborhood": "Summerlin", "city": "Las Vegas", "state": "NV" }
```

**By zip code:**
```json
{ "zip": "89135", "state": "NV" }
```

You can combine multiple locations in the array:
```json
[
  { "neighborhood": "Summerlin", "city": "Las Vegas", "state": "NV" },
  { "neighborhood": "Henderson", "state": "NV" }
]
```

---

## Building a Community/City Landing Page

### Deriving Search Params From the Page Name

When given a page name like **"Summerlin Homes For Sale"**, automatically derive:

| Page concept | `locations` to use |
|---|---|
| Named community (e.g. Summerlin, Henderson, North Las Vegas) | `{ "neighborhood": "COMMUNITY_NAME", "city": "Las Vegas", "state": "NV" }` |
| City-level page (e.g. Las Vegas, Henderson) | `{ "city": "CITY_NAME", "state": "NV" }` |
| Zip code page | `{ "zip": "ZIPCODE", "state": "NV" }` |

**Default values to use unless specified otherwise:**
- `propertyTypes`: `["house", "condo", "townhouse"]`
- `status`: `"active"`
- `minPrice`: whatever the page specifies (e.g. "$200K+" → `200000`)
- `maxPrice`: omit unless specified

### Gallery Div — Squarespace vs Standalone

**On a Squarespace site** (YLOPO scripts already loaded by their integration):
```html
<div class="YLOPO_resultsWidget" data-search='{"locations":[{"neighborhood":"Summerlin","city":"Las Vegas","state":"NV"}],"propertyTypes":["house","condo","townhouse"],"minPrice":200000}'></div>
```
Just the div. No script tags. Adding the YLOPO scripts again causes conflicts.

**On a standalone HTML page** (our `index.html` pattern):
```html
<!-- In <head> -->
<script>
  var YLOPO_HOSTNAME = 'search.crightonrinalditeam.com';
  window.YLOPO_WIDGETS = { domain: 'search.crightonrinalditeam.com' };
</script>

<!-- Where listings should appear -->
<div class="YLOPO_resultsWidget" data-search='{"locations":[{"neighborhood":"Summerlin","city":"Las Vegas","state":"NV"}],"propertyTypes":["house","condo","townhouse"],"minPrice":200000}'></div>

<!-- Before </body> -->
<script src="https://d2hnwe88wt837l.cloudfront.net/build/js/widgetBuilder~runtime.js"></script>
```

### Deployment Note
The YLOPO widget only renders on domains registered in the client's YLOPO account. It will not render on `localhost`. When testing locally, the page layout will appear correctly but the listing grid will be empty — this is expected. Deploy to a live domain and have the client add it to their YLOPO allowed origins.

---

## YLOPO Configuration Source
To generate or update the gallery code with new search criteria, go to:
`https://search.crightonrinalditeam.com/widgets`

- Use the filter form to configure the search (area, price, property types, status)
- Click **"See Listings"** to generate the gallery div code
- Copy the `data-search` attribute value from the generated code

---

## Page Template Pattern

Each landing page should have:
1. **Nav** — client logo + basic links + contact CTA
2. **Hero** — headline matching the page name (e.g. "Summerlin Homes For Sale"), subtitle with key details, stat cards (listing count, price range, property types)
3. **YLOPO Gallery Widget** — full-width listings grid
4. **Footer** — client name, copyright, MLS disclosure

### Headline Formula
`[Community/City] Homes For Sale` + price qualifier if applicable (`$200K and Up`, `$500K–$1M`, etc.)

### Stat Cards to Show
Pull these from the page's search params:
- Listing count (use "500+" or "1,000+" as approximate if not known exactly)
- Price range (e.g. "$200K+", "$500K–$1M")
- Property types count (e.g. "3" if house/condo/townhouse)
- Update frequency ("Daily")

---

## Client Details
- **Client**: Nevada Real Estate Group
- **YLOPO domain**: `search.crightonrinalditeam.com`
- **Market**: Las Vegas, NV metro area
- **Widget config page**: `https://search.crightonrinalditeam.com/widgets`

---

## Maintenance Instructions
After every significant change, update this file to reflect:
- New features or components added
- Decisions made and why
- Current status and what's next
- Any new conventions established

