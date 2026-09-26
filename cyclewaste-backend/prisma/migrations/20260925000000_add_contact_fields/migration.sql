-- Adds contact info fields used to show partner (teknisi/recycler) contact
-- details to owners once a transaction has progressed, and to display a
-- human-readable address on drop-off points / the map.

ALTER TABLE "users" ADD COLUMN "telepon" TEXT;
ALTER TABLE "dropoff_points" ADD COLUMN "alamat" TEXT;
