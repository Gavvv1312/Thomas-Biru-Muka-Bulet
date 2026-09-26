# Peta Mitra — geocoding setup

The partner-facing "Kelola Lokasi" page (`/mitra/lokasi`, teknisi/recycler
only) lets a partner type a street address and get map coordinates back,
instead of having to hunt down raw latitude/longitude numbers themselves.
That address → coordinates lookup is called **geocoding**, and it's the
"external API" this feature is built to plug into.

Everything geocoding-related lives in one file:
`cyclewaste-frontend/src/lib/geocoding.js`.

## Default: no setup needed

Out of the box, this uses **Nominatim** (OpenStreetMap's free, keyless
geocoding search) — same map tiles this app already uses on the "Peta
Mitra" page, so the API key/vendor lock-in situation stays the same as
what you already have. Nothing to configure; it works immediately.

**Its limits, worth knowing:**
- Rate-limited to roughly 1 request/second — fine for a handful of
  partners occasionally registering a location, not fine for anything
  high-volume.
- Its usage policy asks that production apps either self-host their own
  Nominatim instance or move to a paid provider rather than hammering the
  public one: https://operations.osmfoundation.org/policies/nominatim/
- Address matching quality is decent for well-formed Indonesian addresses
  but not as good as Google's.

For a hobby project or early-stage pilot, the default is genuinely fine.
Switch providers once you have real usage volume or need better address
matching.

## Switching to Google Maps or Mapbox

Both are already stubbed out in `geocoding.js` (`geocodeWithGoogle` /
`geocodeWithMapbox`) — they just need an API key.

### Option A — Google Maps Geocoding API

1. In Google Cloud Console, enable the **Geocoding API** for a project and
   create an API key (Console → APIs & Services → Credentials).
2. **Restrict the key** to the Geocoding API only, and to your frontend's
   domain (HTTP referrer restriction) — this key will be visible in
   client-side JS, so restricting it is not optional.
3. In `cyclewaste-frontend/.env`:
   ```env
   VITE_GEOCODING_PROVIDER=google
   VITE_GEOCODING_API_KEY=your-key-here
   ```
4. Restart `npm run dev` (Vite only reads `.env` at startup).

Pricing: Google's Geocoding API has a free monthly credit, then charges
per request past that — check current pricing before relying on it at
volume: https://developers.google.com/maps/documentation/geocoding/usage-and-billing

### Option B — Mapbox Geocoding API

1. Create a Mapbox account, grab your default public token (or create a
   scoped one) from https://account.mapbox.com/access-tokens/.
2. In `cyclewaste-frontend/.env`:
   ```env
   VITE_GEOCODING_PROVIDER=mapbox
   VITE_GEOCODING_API_KEY=your-token-here
   ```
3. Restart `npm run dev`.

Mapbox also has a generous free tier; check current limits before
committing: https://www.mapbox.com/pricing

## Adding a different provider entirely

Open `geocoding.js` and add one function following the same shape as the
existing ones:

```js
async function geocodeWithYourProvider(query) {
  // call the provider's API with `query`
  // return { lat, lon, displayName } or null if nothing found
}
```

Then add it to the `PROVIDERS` map at the bottom of the file:

```js
const PROVIDERS = {
  nominatim: geocodeWithNominatim,
  google: geocodeWithGoogle,
  mapbox: geocodeWithMapbox,
  yourprovider: geocodeWithYourProvider, // add this line
};
```

Set `VITE_GEOCODING_PROVIDER=yourprovider` and you're done — nothing else
in the app needs to change, since every page that uses geocoding calls the
single `geocodeAddress()` export, not a specific provider.

## Where this is actually used

- `src/pages/ManageLocation.jsx` — the only current caller. A partner
  types an address, hits the search icon, and the returned lat/lng
  auto-fills the form (still manually editable/overridable before saving).
- The map itself (`src/pages/MapPage.jsx`) does **not** use geocoding — it
  just displays whatever lat/lng is already stored on each drop-off point.
  Geocoding only matters at the point of *creating or updating* a
  location, not at browsing time.

## Security note

Whichever provider you pick, its API key ends up in client-side JavaScript
(anything with `VITE_` prefix is bundled into the shipped app — this is
how Vite env vars work, not a bug). This is why the Google/Mapbox setup
steps above both say to **restrict the key** (by domain/referrer, and to
the specific API/product you need) rather than using an unrestricted key.
Nominatim needs no key at all, which sidesteps this entirely — one more
reason it's a reasonable default while volume is low.
