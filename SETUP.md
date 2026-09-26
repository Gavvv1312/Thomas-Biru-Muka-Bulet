# CycleWaste — Setup Guide

Covers running the whole stack locally (Postgres → backend API → React
frontend) and the notes you'll need when you actually deploy it.

Two folders, two independent deployables:

```
cyclewaste-backend/    Express + Prisma + PostgreSQL REST API
cyclewaste-frontend/   React + Vite + Tailwind + Framer Motion SPA
```

---

## 0. Prerequisites

- **Node.js** 18+ and npm (both backend and frontend use it — backend via
  `tsx`/TypeScript, frontend via Vite)
- **PostgreSQL** 14+ running somewhere you can reach (local install, Docker,
  or a managed service like Supabase/Neon/RDS)
- A terminal, and optionally `psql` if you want to inspect the DB by hand

---

## 1. Database

You have two ways to get the schema in. Pick one.

### Option A — fresh database via Prisma (recommended)
Let Prisma create the schema for you; skip to step 2 and run
`npm run prisma:migrate` there. Nothing to do here except make sure an
empty database exists:

```bash
createdb cyclewaste
# or, from psql:
# CREATE DATABASE cyclewaste;
```

### Option B — restore from the SQL dump
If you'd rather restore the exact dump that shipped with this project
(`cyclewaste-backend/prisma/data/cyclewaste-dump.sql`) — note it only
contains schema (tables/enums/constraints), no rows, since that's how it
was exported:

```bash
createdb cyclewaste
psql -d cyclewaste -f cyclewaste-backend/prisma/data/cyclewaste-dump.sql
```

If you restore this way, skip `prisma migrate dev` in step 2 (schema's
already there) — just run `prisma generate` so the TypeScript client is
built, then seed.

---

## 2. Backend

```bash
cd cyclewaste-backend
npm install
```

### Configure environment
The project already includes a working `.env` (copied from your original
upload — DB name is already `cyclewaste`). If you're starting fresh instead,
copy the example and fill it in:

```bash
cp .env.example .env
```

Edit `.env`:

```env
NODE_ENV=development
PORT=3000

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/cyclewaste"

JWT_ACCESS_SECRET="replace_me_with_strong_random_string"
JWT_REFRESH_SECRET="replace_me_with_another_strong_random_string"

ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"

CORS_ORIGIN="http://localhost:3000"
```

- `DATABASE_URL` — point this at your Postgres instance/database from step 1.
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — generate real random strings
  for anything beyond local dev, e.g. `openssl rand -hex 32`.
- `CORS_ORIGIN` — **must match wherever the frontend is served from.**
  Locally that's usually `http://localhost:5173` or `http://localhost:8080`
  (whatever static server you use in step 3) — not `:3000`, since the
  backend itself runs there. In production, set this to your deployed
  frontend's URL (e.g. `https://cyclewaste.id`).

### Set up the schema + demo data

```bash
npm run prisma:generate     # generates the Prisma client
npm run prisma:migrate      # applies migrations (skip if you restored the SQL dump in step 1B)
npm run prisma:seed         # loads demo accounts + sample devices/transactions
```

### Run it

```bash
npm run dev
```

You should see the CycleWaste API startup log on `http://localhost:3000`.
API docs (Swagger) are at `http://localhost:3000/api-docs` if you want to
poke endpoints directly.

For a production build instead of `dev`:

```bash
npm run build
npm start
```

### Demo accounts (all seeded with password `password123`)

| Role     | Email                    |
|----------|--------------------------|
| Owner    | owner@cyclewaste.id      |
| Owner 2  | siti@cyclewaste.id       |
| Teknisi  | teknisi@cyclewaste.id    |
| Recycler | recycler@cyclewaste.id   |
| Admin    | admin@cyclewaste.id      |

### If your database was already seeded before this update

`npm run prisma:migrate` adds two new nullable columns (`users.telepon`,
`dropoff_points.alamat`) — safe to run against an existing database, but it
won't backfill values into rows that already existed. If you already ran
the seed script before this update landed, run the one-off backfill
instead of re-seeding (re-seeding fails on the unique email constraint):

```bash
psql -d cyclewaste -f prisma/data/backfill_contact_info.sql
```

(Adjust `-d cyclewaste` if your database has a different name.)

---

## 3. Frontend

React + Vite. Install and configure before running.

```bash
cd cyclewaste-frontend
npm install
cp .env.example .env
```

### Point it at your backend
Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

This is already the default for local dev — you only need to change it
before deploying (point it at your real backend domain).

### Geocoding (optional)
The partner "Kelola Lokasi" page can look up coordinates from a typed
address. Works out of the box with no setup (free Nominatim/OpenStreetMap
provider). See `GEOCODING_SETUP.md` if you want to switch to Google Maps
or Mapbox for better address matching.

### Run it

```bash
npm run dev
```

Vite serves it at `http://localhost:5173` by default. Log in with one of
the demo accounts above — use the "Mitra (Teknisi/Recycler)" tab on the
login page for the teknisi/recycler/admin accounts.

For a production build:

```bash
npm run build      # outputs to dist/
npm run preview    # serve that build locally to sanity-check it
```

`dist/` is a plain static bundle (no server-side rendering) — deploy it to
any static host.

---

## 4. Sanity-check the whole stack

1. Backend running on `:3000`, frontend running on `:5173` (`npm run dev`).
2. Open the frontend → **Login** → `owner@cyclewaste.id` / `password123`.
   You should land on the owner dashboard with Green Points and seeded
   transactions.
3. Go to **Cek Estimasi Baru**, walk through the calculator, and submit —
   it should create a device + valuation + transaction through the real API.
4. Log out, log back in as `teknisi@cyclewaste.id`, and confirm the new
   transaction shows up in the partner queue.

If step 2 fails with a CORS error in the browser console, it's almost
always `CORS_ORIGIN` in the backend `.env` not matching the frontend's
actual origin (including the port — `5173` for the Vite dev server).

---

## 5. Deploying for real

This was built so frontend and backend can live on completely separate
hosts:

- **Frontend**: any static host — Vercel, Netlify, Cloudflare Pages,
  S3+CloudFront, or nginx. Run `npm run build` and upload the `dist/`
  folder's contents (Vercel/Netlify can also just build it for you — build
  command `npm run build`, output directory `dist`).
- **Backend**: anywhere that runs Node — Render, Railway, Fly.io, a VPS,
  etc. Run `npm run build && npm start`, and set real environment variables
  (not the dev secrets in `.env.example`) in your host's dashboard rather
  than committing a `.env` file.
- **Database**: a managed Postgres (Render/Railway/Supabase/RDS/Neon) is
  the least hassle. Point `DATABASE_URL` at it and run
  `npm run prisma:migrate deploy` (the production-safe migrate command)
  once against it before first boot.

Checklist before going live:
- [ ] `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` are real random values, not
      the placeholders
- [ ] `CORS_ORIGIN` is your real frontend domain
- [ ] Frontend's `.env` (`VITE_API_BASE_URL`) points at your real API
      domain, and you ran `npm run build` again after changing it (Vite
      inlines env vars at build time, not runtime)
- [ ] `.env` is **not** committed (there's a `.gitignore` for this in both
      folders already)
- [ ] Decide whether `GET /api/dropoff-points` should stay
      login-required or become public — see `cyclewaste-backend/CHANGES.md`

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Frontend shows a network error on login | Backend isn't running, or `.env`'s `VITE_API_BASE_URL` is wrong (remember: change it, then restart `npm run dev` — Vite only reads `.env` at startup) |
| CORS error in browser console | `CORS_ORIGIN` in backend `.env` doesn't match the frontend's actual origin (`http://localhost:5173` in dev) |
| Login works but dashboard stays on the loading skeleton | Check the Network tab — likely a 401 (token issue) or 500 (check backend logs / DB connection) |
| Calculator submit fails after filling everything in | You're not logged in yet — it should redirect you to login and resume automatically; if it doesn't, check that `sessionStorage` isn't being blocked (private/incognito mode with strict settings) |
| `npm run prisma:migrate` fails | Check `DATABASE_URL` is correct and the target database exists and is reachable |
| `npm install` in the frontend fails or the map doesn't render | Check your network/registry access — `leaflet`/`react-leaflet` and the rest are fetched from npm on install |
