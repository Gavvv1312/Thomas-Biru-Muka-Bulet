# CycleWaste — Frontend (React + Vite)

React 18 + Vite + Tailwind CSS + Framer Motion frontend for the CycleWaste
e-waste reverse-logistics platform.

See `CHANGES.md` for a log of bugs found/fixed across sessions — worth
reading before making further changes, since a few of them (the field-casing
convention especially) are easy to accidentally "fix" backwards if you
don't know the context. See `GEOCODING_SETUP.md` if you're touching
anything related to the partner location/map features.

## Stack

- **React 18** + **Vite** — SPA, client-side routing via `react-router-dom`
- **Tailwind CSS** — CSS-variable-based color tokens (see "Dark mode"
  below) + a small set of hand-authored component classes in
  `src/index.css` for things Tailwind doesn't express cleanly (buttons,
  cards, badges, inputs)
- **Framer Motion** — page transitions, modal enter/exit, hover/tap
  micro-interactions, staggered list/card entrances
- **react-leaflet** + **Leaflet** — the partner/drop-off map (OpenStreetMap
  tiles)
- **Axios** — API client with interceptors for JWT attach + silent refresh
- **react-icons** (Feather set) — nav/sidebar iconography

Plain JavaScript (`.jsx`), not TypeScript — this codebase predates that
choice being reconsidered; see "Not TypeScript" below if that's on your
list of things to change.

## Project structure

```
index.html                 Vite entry HTML (fonts, root div)
src/
  main.jsx                 Mounts <App/> inside BrowserRouter + ThemeProvider + AuthProvider
  App.jsx                  Route table, wrapped in <AnimatePresence> for
                            page-transition animations
  index.css                Tailwind directives + component classes +
                            light/dark CSS variable definitions

  lib/
    api.js                 Axios client — endpoint map, JWT storage, 401 refresh
    AuthContext.jsx         React context: user, login, register, logout
    ThemeContext.jsx         Light/dark state, persisted to localStorage
    geocoding.js             Pluggable address → coordinates lookup (see
                             GEOCODING_SETUP.md)

  data/
    valuationData.js       Calculator category/component/condition metadata
                            (keys mirror backend config/valuation_rules.json)
    transactionStages.js    Per-jalur lifecycle stages + plain-language
                            explanations, used by TransactionDetailModal

  components/
    BrandMark.jsx           Logo mark (fixed colors regardless of theme)
    CategoryIcon.jsx         Device-category glyphs for the calculator
    ProtectedRoute.jsx      Auth/role route guard
    TransactionDetailModal.jsx  Lifecycle stepper + values + partner contact card
    ui/                     Button, LinkButton, Card, Badge, Modal, Skeleton,
                             StepDots, Spinner, ThemeToggle, AuroraBlob
    layout/                 PublicNavbar (Login role-dropdown + theme toggle),
                             Footer, DashboardShell (animated sidebar + theme toggle),
                             PageTransition (per-route fade/slide wrapper)

  pages/
    Landing.jsx             Hero, "cara kerja", channel explainer, personas
    Login.jsx                Owner/Mitra tabs, resume-after-login flow
    Register.jsx             Owner-only registration
    Calculator.jsx           5-step animated wizard → creates device +
                              valuation + transaction via the real API
    Dashboard.jsx             Owner dashboard: Green Points, stats, history,
                              click a transaction row for full detail
    PartnerDashboard.jsx     Teknisi/recycler action queue + modals +
                             "Lihat Proses" detail view
    ManageLocation.jsx       Partner page: create/update their drop-off
                             point, with address geocoding
    MapPage.jsx               Leaflet map + location list, all roles
    NotFound.jsx
```

## Setup

```bash
npm install
cp .env.example .env   # then edit VITE_API_BASE_URL if needed
npm run dev
```

Runs on `http://localhost:5173` by default. Point it at a running
`cyclewaste-backend` — set `VITE_API_BASE_URL` in `.env`
(`http://localhost:3000/api` locally).

**Backend CORS**: make sure the backend's `CORS_ORIGIN` matches this app's
origin (`http://localhost:5173` in dev).

```bash
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

`dist/` is a plain static bundle — deploy it anywhere that serves static
files (Vercel, Netlify, S3+CloudFront, nginx). No build-time secrets other
than `VITE_*` env vars, which get inlined into the bundle at build time
(not runtime) — remember to rebuild after changing `.env` for production.

## Dark mode

Toggle button (sun/moon icon) lives in the top-right of both the public
navbar and every dashboard sidebar. Persists to `localStorage`; before
you've explicitly toggled it once, it follows your OS-level light/dark
setting live.

**How to keep new components theme-safe**: always reach for the existing
color tokens — `bg-paper`, `bg-surface`, `text-ink`, `text-ink-soft`,
`border-line`, `bg-moss`, `text-moss-deep`, `bg-signal`, `text-signal-deep`,
`bg-copper`, `text-copper-deep`, `text-danger` (with Tailwind's opacity
modifier syntax, e.g. `bg-signal/15`, all work fine) — never a raw Tailwind
gray (`bg-gray-100`) or a hardcoded hex value. Every one of those tokens is
wired to a CSS variable that already flips between light and dark (see
`:root` / `.dark` in `src/index.css`), so using them is enough — you don't
need to write `dark:` variants yourself.

The one place this doesn't work is animating a color value directly via
Framer Motion's `animate={{ backgroundColor: "#hex" }}` — that needs an
actual computed value, not a class, and won't respond to the theme. If you
need to animate between colors, animate a different property (size,
position, opacity) and let a Tailwind background/text class handle the
color via CSS transition instead — see `StepDots.jsx` for the pattern
(and `CHANGES.md` for why it was changed from the alternative).

## How this maps to the real backend

`src/lib/api.js` documents the mapping from generic route-group names to
the backend's actual paths (`/dropoff-points` not `/dropoff`,
`/users/:id/dashboard` not `/dashboard`, etc.) in its header comment.

Request bodies use **snake_case** (`tahun_rilis`, `estimated_weight_grams`,
`nama_komponen`, `device_id`, `partner_id`, `harga_tawar`,
`verified_weight_grams`, `verification_notes`, `harga_final`,
`nama_lokasi`) — this matches the backend's zod validators exactly, and
the backend's controllers translate to camelCase before calling services.
**Do not change these to camelCase** — see `CHANGES.md` for the story of
why that's a recurring temptation and why it's wrong.

## Auth & route protection

- `AuthContext` hydrates from `localStorage` (`cw_access_token`,
  `cw_refresh_token`, `cw_user`) on load.
- `ProtectedRoute` redirects to `/login` (preserving `?next=`) when logged
  out, and to the right dashboard when a logged-in user's role doesn't
  match the route's allowed roles.
- `/dashboard` → `owner`/`admin`. `/mitra` and `/mitra/lokasi` →
  `teknisi`/`recycler` (`/mitra` also allows `admin`). `/peta` requires
  login (any role) — matches the backend's current
  `GET /dropoff-points` auth requirement.
- The calculator (`/kalkulator`) is browsable logged-out; only the final
  "Hitung Estimasi" submission requires login, saving progress to
  `sessionStorage` and resuming automatically after login.

## Honest note on "Saldo E-Wallet"

The partner dashboard's summary cards include **Saldo E-Wallet**. The
backend has no wallet ledger endpoint or table — it's computed
client-side as the sum of `hargaFinal` across that partner's completed
buyback transactions (already returned by `GET /transactions`), and
labeled with a small caption ("dari transaksi buyback selesai") so it's
clear what it represents rather than implying a real running balance.

## Not TypeScript

This project doesn't use TypeScript. If a future task asks you to
integrate a `.tsx` component (shadcn or otherwise), you have two
reasonable options: convert that one component to `.jsx` (drop type
annotations, keep the logic — usually mechanical), or migrate the whole
project to TypeScript first (bigger job: rename files, add `tsconfig.json`,
convert `PropTypes`-equivalent expectations gradually). This codebase
isn't a shadcn project either (no `components.json`, no `@/lib/utils`
`cn()` helper) — see `AuroraBlob.jsx` for an example of adapting a
shadcn-style component's *effect* without adopting its whole toolchain.

## Known limitations / things to revisit

- `GET /api/dropoff-points` requires auth — see
  `cyclewaste-backend/CHANGES.md` for the one-line fix if you want a
  public map.
- "Saldo E-Wallet" is derived, not a real ledger — see above.
- No self-service "edit my profile" page yet for a partner to update their
  own `telepon` after the fact — currently a manual DB edit.
- No SSR/SEO optimization — client-rendered SPA throughout.
