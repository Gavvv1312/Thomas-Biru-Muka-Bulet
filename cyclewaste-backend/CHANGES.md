# Changes made to the backend (E-Circuit Hub → CycleWaste)

## 1. Rebrand (cosmetic, no behavior change)
- `package.json` / `package-lock.json`: package name, description, author
  (`e-circuit-hub-backend` → `cyclewaste-backend`).
- `.env.example`: sample `DATABASE_URL` database name (`e_circuit_hub` → `cyclewaste`).
- `src/server.ts`: startup log message.
- `src/docs/swagger.ts`: Swagger title/description.
- `prisma/seed.ts`: demo account emails/names (`@ecircuit.com` → `@cyclewaste.id`,
  `Admin ECircuit` → `Admin CycleWaste`).
- `src/services/transactionService.ts`: recycling certificate number prefix
  (`ECH-YYYY-XXXXX` → `CW-YYYY-XXXXX`).

None of this touches the database schema, so no new Prisma migration was
required for the rebrand itself.

## 2. Bug fix: seed data didn't match the valuation rules
`config/valuation_rules.json`'s `component_base_values` keys are English
(`motherboard`, `battery`, `screen`, `ram`, `storage`, ...). `prisma/seed.ts`
was creating demo devices with **Indonesian** component names (`layar`,
`baterai`) that don't exist in that lookup table. `getComponentBaseValue()`
falls back to `0` on a miss, so every seeded smartphone silently valued its
screen and battery at Rp 0.

Fixed by renaming the seeded component keys to match the rules file
(`layar` → `screen`, `baterai` → `battery`).

## 3. `cycle-waste.sql` (your exported dump)
Compared structurally against `prisma/migrations/20260921125850_init/migration.sql`
— same tables, enums, columns, constraints and indexes (just pg_dump's
formatting vs. Prisma's migration formatting). No schema drift. Included
as-is at `prisma/data/cyclewaste-dump.sql` for reference/restore.

## 4. CORS_ORIGIN default updated for the React rebuild
The frontend was rebuilt on Vite, whose dev server defaults to port **5173**,
not 3000 (3000 is this backend's own port). `.env.example` and `.env` now
default `CORS_ORIGIN` to `http://localhost:5173`. Update this to your real
deployed frontend origin in production either way.

## 5. Bug fix: request-body field casing mismatch in deviceController
**Symptom**: `POST /devices` failed at the Prisma layer with `tahunRilis`
missing and `namaKomponen: undefined`, even though the request body had
valid data and passed zod validation.

**Root cause**: the validator (`src/middlewares/validate.ts` + its zod
schema) requires snake_case fields (`tahun_rilis`, `estimated_weight_grams`,
`components[].nama_komponen`) — this is what the frontend correctly sends.
But `deviceService.createDevice()` is typed and implemented in camelCase
(`tahunRilis`, `estimatedWeightGrams`, `components[].namaKomponen`), matching
the Prisma schema. `deviceController.createDevice` was passing `req.body`
straight through with **no translation between the two**, so the camelCase
reads inside the service came up `undefined`.

`transactionController.ts` already did this translation correctly in every
handler (`createTransaction`, `makeOffer`, `verify`, `complete`) — it just
wasn't applied consistently to `deviceController.ts`.

**Fix** — `src/controllers/deviceController.ts`, `createDevice`:
```ts
createDevice: async (req: AuthenticatedRequest, res: Response) => {
  const { tahun_rilis, estimated_weight_grams, components, ...rest } = req.body;
  const device = await deviceService.createDevice(req.user!.userId, {
    ...rest,
    tahunRilis: tahun_rilis,
    estimatedWeightGrams: estimated_weight_grams,
    components: (components || []).map((c: { nama_komponen: string; kondisi: string }) => ({
      namaKomponen: c.nama_komponen,
      kondisi: c.kondisi,
    })),
  });
  res.status(201).json(successResponse(device, 'Device berhasil dibuat'));
},
```

**If you add new endpoints**: the convention in this codebase is snake_case
over the wire (request bodies), camelCase inside services (matching Prisma).
That translation must happen in the controller. It's easy to forget — check
for it explicitly when adding anything new, rather than assuming it's
automatic.

## 6. Bug fix: transaction/dashboard queries didn't include the device's valuation
**Symptom**: after submitting the calculator, both the owner dashboard and
the partner dashboard showed `—` for "Nilai/Berat" on any transaction that
hadn't had an offer made or been verified yet — even though a valuation
(price range or weight estimate) was calculated and stored when the device
was created.

**Root cause**: three read queries fetched `device` without its nested
`valuation` relation, so the frontend had nothing to fall back on before an
explicit offer/verification existed:

- `transactionService.getTransactions` — `include: { device: true, ... }`
- `transactionService.getTransactionById` — same
- `dashboardService.getUserDashboard` — `select: { kategori, merek, tipe }`
  (no `estimatedWeightGrams`, no `valuation` at all)

**Fix** — add the nested relation/fields to each:
```ts
// transactionService.ts — getTransactions and getTransactionById
include: { device: { include: { valuation: true } }, user: true, partner: true },

// dashboardService.ts — getUserDashboard's latestTransactions query
include: { device: { select: { kategori: true, merek: true, tipe: true, estimatedWeightGrams: true, valuation: true } } },
```

Note: `createTransaction`, `makeOffer`, `verify`, `complete`, and `cancel`
in `transactionService.ts` were **not** changed — those are write-action
responses, and the frontend re-fetches the list (via the now-fixed
`getTransactions`) right after each action anyway, so they didn't need it.
If you build a UI that renders the valuation directly off one of those
mutation responses, add `{ include: { valuation: true } }` to that one's
`device` include too.

**Frontend counterpart**: `Dashboard.jsx` and `PartnerDashboard.jsx` both
needed a `valueDisplay(t)` helper to actually render the fallback (real
figure once one exists → estimate from `device.valuation` otherwise → `—`
only if truly nothing exists yet). See `cyclewaste-frontend/CHANGES.md`.

## 7. Security fix: full User objects (including passwordHash) were being returned over the API
**Found while adding partner contact info** (§9 below) — `transactionService.ts`
had nine separate Prisma queries using `include: { user: true, partner: true }`.
Since Prisma's `include: { relation: true }` returns **every scalar field**
on that relation, this meant every transaction-related endpoint
(`GET /transactions`, `GET /transactions/:id`, `createTransaction`,
`makeOffer`, `verify`, `complete`, `cancel`) was shipping each user's bcrypt
`passwordHash` to any authenticated client that could see that transaction.
`successResponse()` doesn't strip anything — it's a pure passthrough.

Not exploitable for a fast account takeover (bcrypt hashes aren't
reversible), but it's real attack surface: an exposed hash enables offline
dictionary/brute-force attempts with no rate limiting from this API, and
it's worth fixing regardless of how likely an actual exploit is.

**Fix**: added a `SAFE_USER_SELECT` constant near the top of
`transactionService.ts` and replaced every `user: true` / `partner: true`
with `user: { select: SAFE_USER_SELECT }` / `partner: { select: SAFE_USER_SELECT }`
(`{ id, nama, email, role, telepon }` — no `passwordHash`, no
`createdAt`/`updatedAt` clutter). Also applied the same narrow `select` in
`dashboardService.ts`'s and `dropOffService.ts`'s partner includes rather
than reintroducing the same mistake in new code.

**If you add a new query that includes `user` or `partner`**: use
`{ select: SAFE_USER_SELECT }` (import it from `transactionService.ts`, or
copy the same field list), never `true`.

## 8. Schema: added `User.telepon` and `DropOffPoint.alamat`
New nullable columns via migration `20260925000000_add_contact_fields`:
- `users.telepon` — a partner's phone/WhatsApp number, shown to owners on
  the transaction detail view once they're paired with a teknisi/recycler.
- `dropoff_points.alamat` — human-readable street address, shown on the map
  and in transaction detail, alongside the existing lat/lng.

Both nullable, so this migration has zero effect on existing rows — they'll
just read as `null` until filled in. `prisma/seed.ts` was updated to
populate these for **new** seed runs. If your database was already seeded
before this migration, re-seeding will fail on the unique email constraint
(same as always) — use `prisma/data/backfill_contact_info.sql` instead to
fill in the two demo accounts' `telepon` and the two seeded drop-off
points' `alamat` directly.

## 9. Bug fix: `nama_lokasi` → `namaLokasi` casing gap in dropOffController (same pattern as §5)
Identical root cause to §5, found before it could bite: `dropOffController.createDropOffPoint`
and `updateDropOffPoint` passed `req.body` straight through to
`dropOffService`, which expects camelCase (`namaLokasi`). The validator
requires snake_case (`nama_lokasi`). This had never actually failed in
practice because nothing in the frontend called `POST /dropoff-points`
until this session added the "Kelola Lokasi" partner page — so it would
have broken on first real use exactly like `deviceController` did.

Fixed the same way: explicit snake_case → camelCase translation in both
controller methods, plus added a proper `dropOffPointUpdateSchema` (the
`PATCH` route previously validated the `:id` param but never validated the
request body at all).

## 10. Bug fix: owner dashboard silently dropped `hargaTawar`
`dashboardService.ts`'s `getUserDashboard` manually re-mapped each
transaction to a plain object for the response (rather than returning the
Prisma result directly) — and that manual field list included
`hargaFinal` and `verifiedWeightGrams` but not `hargaTawar`. So once a
technician made an offer, the owner's dashboard had the real data from
Postgres but threw it away before it reached the browser, showing `—`
instead of the offered price. Also added `partner` to this same query/
mapping, since the owner dashboard needed it for the new contact-info
feature (§9/§11).

## 11. Frontend features added this session (context for backend changes above)
- **Dark mode** toggle (CSS-variable-based theming — see
  `cyclewaste-frontend/CHANGES.md`).
- **Transaction detail modal**: a lifecycle stepper (Diajukan → Ditawar →
  Diverifikasi → Selesai, buyback only has the Ditawar stage) with a
  plain-language explanation of the current stage, plus the partner's
  contact info (phone/WhatsApp) once one exists on a transaction — this is
  what needed `User.telepon` and the passwordHash-leak fix above.
- **"Kelola Lokasi" partner page** (`/mitra/lokasi`): lets a teknisi/recycler
  create/update their own drop-off point, including an address-to-coordinates
  lookup via a pluggable geocoding module (defaults to free/keyless
  Nominatim; see `cyclewaste-frontend/GEOCODING_SETUP.md` to swap in Google/
  Mapbox). This is what actually exercises `POST`/`PATCH /dropoff-points`
  for the first time — hence finding §9.
- Hero visual on the landing page redesigned (was an abstract blob with
  disconnected decorative lines/dots that didn't represent anything).


## Not changed, worth knowing about before you deploy
- `GET /api/dropoff-points` currently requires authentication
  (`src/routes/dropoff.ts`). The frontend's map page (`/peta`) therefore
  gates on login for all roles. If you want a public map (browsable before
  signup), drop `authenticate` from that one `GET` route — it doesn't
  return anything user-specific.
- Public registration only ever creates `owner` role accounts
  (`authService.register` forces this server-side) — teknisi/recycler/admin
  accounts still need to be provisioned out of band (seed script, or
  directly via Prisma Studio / SQL). There's still no self-service "edit my
  profile" endpoint for a partner to set their own `telepon` after the
  fact — for now that's a manual DB edit (Prisma Studio) or a re-run of the
  seed/backfill. A real profile-edit endpoint would be a reasonable next
  addition if partners need to update their own contact info without your
  intervention.
