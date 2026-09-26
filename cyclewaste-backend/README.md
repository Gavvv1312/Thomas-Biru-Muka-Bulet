# CycleWaste — Backend

Express + TypeScript + Prisma + PostgreSQL REST API for the CycleWaste
e-waste reverse-logistics platform (rebranded from "E-Circuit Hub" — see
`CHANGES.md` for everything that changed and why).

## Stack

- **Express** + TypeScript, run via `tsx` in dev
- **Prisma** ORM over **PostgreSQL**
- **JWT** access + refresh token auth (`jsonwebtoken`)
- **zod** request validation (`src/middlewares/validate.ts` + schemas)
- **Swagger** API docs, served at `/api-docs` when the server is running

## Project structure

```
src/
  server.ts               Entry point
  app.ts                  Express app, middleware, route mounting
  config/
    index.ts               Env config
    valuationRules.ts       Loads config/valuation_rules.json
  controllers/              Request/response handling, snake_case ↔ camelCase
                             translation between API body and service layer
  services/                 Business logic, Prisma calls (camelCase, matches
                             the Prisma schema field names)
  routes/                   Express routers per resource
  middlewares/               auth (JWT), validate (zod), error handling
  validators/schemas.ts       zod schemas — snake_case field names, this is
                              the source of truth for what the API accepts
  docs/swagger.ts             Swagger/OpenAPI setup
  utils/                     errors, response envelope helpers

config/valuation_rules.json  Rule-based valuation engine's component base
                             values, condition multipliers, channel
                             recommendation thresholds

prisma/
  schema.prisma              Data model
  seed.ts                    Demo accounts + sample devices/transactions
  migrations/                 Migration history
  data/cyclewaste-dump.sql    Reference SQL dump (see CHANGES.md §3)
  data/backfill_contact_info.sql  One-off SQL to backfill telepon/alamat
                                  on an already-seeded database (see CHANGES.md §8)

tests/                       vitest test suite
```

## Setup

```bash
npm install
cp .env.example .env   # then fill in DATABASE_URL, JWT secrets, CORS_ORIGIN
npm run prisma:generate
npm run prisma:migrate   # applies schema + prompts for a migration name
npm run prisma:seed      # demo accounts, password123 for all
npm run dev               # http://localhost:3000
```

See the top-level `SETUP.md` (one level up, alongside both project folders)
for the full walkthrough including PostgreSQL setup and connecting the
frontend.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Run via `tsx watch` — auto-restarts on file changes |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Run the compiled build (`node dist/server.js`) — use after `build`, for production |
| `npm run prisma:generate` | Regenerate the Prisma client after schema changes |
| `npm run prisma:migrate` | Create/apply a migration (dev) |
| `npm run prisma:studio` | Visual DB browser at `localhost:5555` |
| `npm run prisma:seed` | Seed demo data |
| `npm test` | Run the vitest suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | ESLint over `src/` |

## API shape

Every response is wrapped: `{ success: boolean, message: string, data: ... }`.
Errors follow the same envelope with `success: false`.

```
POST   /api/auth/register            owner accounts only (role forced server-side)
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me                  (auth required)

POST   /api/devices                  (auth) create device + component conditions
GET    /api/devices                  (auth) list caller's own devices
GET    /api/devices/:id              (auth)
POST   /api/devices/:id/valuation    (auth) run the rule-based valuation engine
GET    /api/devices/:id/valuation    (auth)

POST   /api/transactions                    (auth) owner submits a transaction
GET    /api/transactions?status=            (auth) role-scoped list
GET    /api/transactions/:id                (auth)
PATCH  /api/transactions/:id/offer          (auth, partner) buyback price offer
PATCH  /api/transactions/:id/verify         (auth, partner) physical verification
PATCH  /api/transactions/:id/complete       (auth, partner) finalize
PATCH  /api/transactions/:id/cancel         (auth)

GET    /api/dropoff-points?tipe=&partner_id=   (auth) — see CHANGES.md if you want GET public
POST   /api/dropoff-points           (auth, teknisi/recycler) create own location
PATCH  /api/dropoff-points/:id       (auth, must own it) update own location

GET    /api/users/:id/dashboard       (auth) owner dashboard summary
GET    /api/users/:id/points          (auth)
GET    /api/users/:id/points/history  (auth)
```

Request bodies use **snake_case** (`tahun_rilis`, `estimated_weight_grams`,
`nama_komponen`, `device_id`, `partner_id`, `harga_tawar`, `nama_lokasi`,
etc.) — this is validated by `src/validators/schemas.ts`. Controllers
translate to camelCase before calling services, which operate in camelCase
matching the Prisma schema exactly. **This translation step is easy to
miss when adding a new endpoint** — it's caused two real bugs so far (see
`CHANGES.md` §5 and §9); check for the same pattern in anything new.

**Never `include`/`select` a full `user`/`partner` relation as `true`.**
Returns every scalar field, including `passwordHash` (see `CHANGES.md`
§7). Use the `SAFE_USER_SELECT` constant defined near the top of
`transactionService.ts` (`{ id, nama, email, role, telepon }`), or copy its
field list into a `select` if you're in a different file.

## Known gaps / things you might want to change

See `CHANGES.md` for the full list with context. Short version:
- `GET /dropoff-points` requires auth; make it public if you want an
  unauthenticated map.
- Public registration is owner-only by design; teknisi/recycler/admin
  accounts are provisioned via the seed script or manually.
- No wallet ledger table exists — the frontend's "Saldo E-Wallet" is derived
  client-side from completed transactions, not a real balance.
- No self-service profile-edit endpoint — a partner's `telepon` (added this
  session, see `CHANGES.md` §8) can only be set via seed data, the backfill
  script, or a manual DB edit right now.
