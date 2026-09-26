-- One-off backfill for the telepon/alamat columns added in migration
-- 20260925000000_add_contact_fields. Only needed if your database already
-- had seeded demo accounts BEFORE that migration ran (re-seeding from
-- scratch would fail on the unique email constraint, so this fills in the
-- new columns on your existing rows instead).
--
-- Run once, after `npm run prisma:migrate` has applied the new migration:
--   psql -d cyclewaste -f prisma/data/backfill_contact_info.sql
-- or paste these statements into Prisma Studio / any Postgres client.

UPDATE "users" SET "telepon" = '+62 812-3456-7890' WHERE "email" = 'teknisi@cyclewaste.id';
UPDATE "users" SET "telepon" = '+62 813-9876-5432' WHERE "email" = 'recycler@cyclewaste.id';

UPDATE "dropoff_points" SET "alamat" = 'Jl. Perintis Kemerdekaan No. 12, Kesambi, Cirebon' WHERE "namaLokasi" = 'Tono Repair Shop';
UPDATE "dropoff_points" SET "alamat" = 'Jl. Cideng Indah No. 45, Harjamukti, Cirebon' WHERE "namaLokasi" = 'Rina Recycling Center';
