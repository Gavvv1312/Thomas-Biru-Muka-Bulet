/**
 * Address → coordinates lookup, used by the partner "Kelola Lokasi" page so
 * a teknisi/recycler can type a street address instead of hunting for raw
 * lat/lng numbers.
 *
 * Default provider: OpenStreetMap's Nominatim — free, keyless, fine for low
 * volume (this app's actual usage — a handful of partners registering a
 * location occasionally). It has a strict rate limit (~1 request/second)
 * and asks that production apps self-host or use a paid provider instead of
 * hammering the public instance: https://operations.osmfoundation.org/policies/nominatim/
 *
 * To swap in a real provider once you have an API key, set these in your
 * frontend .env and see GEOCODING_SETUP.md for the two functions to fill in:
 *   VITE_GEOCODING_PROVIDER=google   (or "mapbox")
 *   VITE_GEOCODING_API_KEY=your-key-here
 *
 * Every provider function below returns the same shape:
 *   { lat: number, lon: number, displayName: string } | null
 */

const PROVIDER = import.meta.env.VITE_GEOCODING_PROVIDER || "nominatim";
const API_KEY = import.meta.env.VITE_GEOCODING_API_KEY || "";

async function geocodeWithNominatim(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Gagal menghubungi layanan pencarian alamat.");
  const results = await res.json();
  if (!results.length) return null;
  return {
    lat: parseFloat(results[0].lat),
    lon: parseFloat(results[0].lon),
    displayName: results[0].display_name,
  };
}

// --- Fill these in when you're ready to switch providers (see GEOCODING_SETUP.md) ---

async function geocodeWithGoogle(query) {
  if (!API_KEY) throw new Error("VITE_GEOCODING_API_KEY belum diisi untuk provider Google.");
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== "OK" || !data.results.length) return null;
  const result = data.results[0];
  return {
    lat: result.geometry.location.lat,
    lon: result.geometry.location.lng,
    displayName: result.formatted_address,
  };
}

async function geocodeWithMapbox(query) {
  if (!API_KEY) throw new Error("VITE_GEOCODING_API_KEY belum diisi untuk provider Mapbox.");
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${API_KEY}&limit=1`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.features?.length) return null;
  const [lon, lat] = data.features[0].center;
  return { lat, lon, displayName: data.features[0].place_name };
}

const PROVIDERS = {
  nominatim: geocodeWithNominatim,
  google: geocodeWithGoogle,
  mapbox: geocodeWithMapbox,
};

/**
 * Look up coordinates for a free-text address. Returns null if nothing was
 * found (not an error — just no match), throws on network/config problems.
 */
export async function geocodeAddress(query) {
  const fn = PROVIDERS[PROVIDER] || PROVIDERS.nominatim;
  return fn(query.trim());
}

export const geocodingProvider = PROVIDER;
