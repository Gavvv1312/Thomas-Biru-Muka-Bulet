# Changes made to the frontend this session

## 1. `valueDisplay()` helper added to Dashboard.jsx and PartnerDashboard.jsx
Both the owner dashboard's "Transaksi Terbaru" table and the partner
dashboard's transaction queue were showing `—` in the value column for any
transaction that hadn't had an offer made or been verified yet.

Added a shared-shape helper (duplicated in both files — small enough not to
warrant extracting to a shared module yet) that falls back through: final
price → verified weight → offered price → **the original calculator
estimate** (`device.valuation.estimasiNilaiMin/Max` for buyback,
`device.estimatedWeightGrams` for recycle) → only `—` if truly nothing
exists. See `cyclewaste-backend/CHANGES.md` §6 for the backend half of this
fix (the relevant queries weren't including `device.valuation` at all).

## Field naming convention — do not "fix" this again
The API payload field names in `src/lib/api.js` and `src/pages/Calculator.jsx`
are **intentionally snake_case** (`tahun_rilis`, `estimated_weight_grams`,
`nama_komponen`, `device_id`, `partner_id`, `harga_tawar`,
`verified_weight_grams`, `verification_notes`, `harga_final`) — this matches
the backend's zod request-body validators exactly.

Mid-session, these were mistakenly changed to camelCase while chasing a bug
that actually lived in the backend (`deviceController.ts` not translating
snake_case → camelCase before calling the service layer — see
`cyclewaste-backend/CHANGES.md` §5). They were reverted back to snake_case,
which is correct. **If a "field X is undefined" error shows up on the
backend side again, check the relevant `*Controller.ts` for a missing
translation step before changing anything here.**

## 2. Bug fix: technician's offer price (hargaTawar) never reached the owner dashboard
Reported: "setelah teknisi ajukan tawaran, harga tawaran teknisi tidak
muncul di user." The partner dashboard showed it fine; the owner dashboard
never did, even after §1's `valueDisplay()` fix (which does handle
`hargaTawar` — it just never received it).

Root cause was entirely backend-side: `dashboardService.ts`'s
`getUserDashboard` manually rebuilt each transaction into a plain object
before returning it, and that object's field list included `hargaFinal`
and `verifiedWeightGrams` but not `hargaTawar`. See
`cyclewaste-backend/CHANGES.md` §10 for the fix. Nothing changed here on
the frontend — `valueDisplay()` already handled this case correctly once
the backend actually sent the field.

## 3. Dark mode
Added a light/dark toggle (sun/moon icon, top-right of both the public
navbar and the dashboard sidebar — `src/components/ui/ThemeToggle.jsx`).

**How it works** — rather than adding `dark:` variants to every className
across every page (huge, error-prone, easy to miss spots), the whole color
system in `tailwind.config.js` was converted to reference CSS custom
properties (`rgb(var(--color-x) / <alpha-value>)`), defined once in
`src/index.css` under `:root` (light) and `.dark` (dark overrides —
applied to `<html class="dark">` by `src/lib/ThemeContext.jsx`). Every
existing `bg-moss`, `text-ink-soft`, `bg-signal/15`, etc. utility class
already in the app now responds to the theme automatically — no
component-by-component changes needed, and none will be needed for new
components either, as long as they use the existing color tokens (`ink`,
`paper`, `surface`, `line`, `moss`, `signal`, `copper`, `danger`) rather
than raw Tailwind grays/hex values.

`ThemeContext.jsx` persists the choice to `localStorage` (`cw_theme`), and
before that's ever set, follows the OS-level light/dark preference live.

**A few spots couldn't use pure CSS variables** and got explicit `.dark`
overrides instead: the status/channel badge colors and alert boxes in
`index.css` (their light-mode hex values were already hardcoded per-status,
so each got a paired `.dark .badge-status-x { ... }` override rather than
a full variable-per-badge refactor), and `StepDots.jsx` (was animating
`backgroundColor` directly via Framer Motion using hardcoded hex — switched
to animating only `width` via Framer Motion and letting a `bg-moss` /
`bg-signal-deep` / `bg-line` className handle color via CSS transition
instead, which is theme-aware for free).

**Left as fixed regardless of theme** (deliberately, not an oversight):
the logo (`BrandMark.jsx`) and the map's marker pin colors
(`MapPage.jsx`) — both are brand/legend elements that should stay
recognizable and consistent rather than shift with the theme.

## 4. Hero visual redesigned
The landing page hero previously showed an abstract blob shape with
disconnected decorative lines and dots meant to evoke "circuitry" — no
actual relationship to anything on the page, reasonably described as
"weird with no clear intentions."

Replaced with a literal, labeled diagram: a device icon → "LALU" →
two clearly-labeled outcome icons (a wrench for Buyback, a recycle icon
for Daur Ulang), with the existing floating "Estimasi nilai" / "Green
Points" callout cards now visually anchored to a diagram that actually
explains what they mean, instead of floating over meaningless doodles.

Also added `src/components/ui/AuroraBlob.jsx` — a soft, slowly-drifting
blurred gradient behind that diagram, in the app's own brand colors
(moss/signal/copper) via the same CSS variables dark mode uses, so it
shifts correctly in both themes. This adapts the *idea* from an
"Aurora Background" shadcn/Aceternity component reference you attached,
without adopting shadcn's CLI, its `cn()` utility, or a `@/lib/utils`
import alias — this project isn't a shadcn project (no
`components.json`, no TypeScript yet either), and pulling in that whole
scaffolding for one background effect wasn't worth it. The visual result
is the same category of effect, built with what's already in this
codebase (Tailwind + Framer Motion + one new keyframe animation).

## 5. Transaction process clarity + partner contact info
Reported: the transaction table alone ("hanya ada tabel transaksi lalu
status dan itu saja") wasn't enough for a non-technical person to
understand what stage a transaction was at or what happens next, and
there was no way to actually contact the assigned teknisi/recycler.

Added `src/components/TransactionDetailModal.jsx`, opened by clicking a
row in the owner dashboard's transaction table, or the new "Lihat Proses"
button in the partner dashboard's action column. Shows:
- A lifecycle stepper (`src/data/transactionStages.js` defines the stages
  per `jalur` — buyback has an extra "Ditawar" step recycle skips) with a
  plain-language sentence explaining the current stage, phrased differently
  depending on whether the viewer is the owner or the partner.
- Rincian nilai (tawaran/final/berat/verification notes/original estimate
  — whichever apply).
- **Owner view only**: a contact card for the assigned teknisi/recycler —
  name, role, and Telepon/WhatsApp buttons (`tel:` and `wa.me` links, built
  from the new `telepon` field — see `cyclewaste-backend/CHANGES.md` §8).
  Not shown to partners (they already know who submitted the request).

`Modal.jsx` gained a `size="lg"` option (640px vs the original 420px) to
fit this content — existing modals didn't pass `size`, so they're
unaffected.

## 6. "Kelola Lokasi" partner page + pluggable geocoding
New page at `/mitra/lokasi` (teknisi/recycler only — `src/pages/ManageLocation.jsx`),
linked from both the partner dashboard sidebar and the map page (a "Kelola
lokasiku →" link shown only to partner roles). Lets a partner create or
update their own drop-off point: name, address (with a "search" button
that geocodes it to lat/lng automatically), and manually-editable
coordinates as a fallback/override.

Geocoding lives in `src/lib/geocoding.js` — defaults to free, keyless
Nominatim (OpenStreetMap), with Google Maps and Mapbox already stubbed in
and selectable via `.env` once you have an API key for either. See
`GEOCODING_SETUP.md` for the full walkthrough, including how to add a
different provider entirely.

`MapPage.jsx` now also shows each location's address (`alamat`) and a
WhatsApp link (built from the partner's `telepon`) in both the sidebar
list and the map popup — both fields are new on the backend (§8).

Note: `POST`/`PATCH /dropoff-points` had never actually been called by any
UI before this — building this page is what surfaced the
`nama_lokasi`/`namaLokasi` casing bug in `dropOffController.ts`, same root
cause as the device-creation bug from earlier this project. See
`cyclewaste-backend/CHANGES.md` §9.
