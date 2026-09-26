import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiGrid, FiMap, FiSearch, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import DashboardShell from "../components/layout/DashboardShell.jsx";
import PageTransition from "../components/layout/PageTransition.jsx";
import Button from "../components/ui/Button.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import { useAuth } from "../lib/AuthContext.jsx";
import api from "../lib/api.js";
import { geocodeAddress, geocodingProvider } from "../lib/geocoding.js";

const NAV_ITEMS = [
  { to: "/mitra", label: "Transaksi Masuk", icon: FiGrid },
  { to: "/peta", label: "Lihat Peta Mitra", icon: FiMap },
  { to: "/mitra/lokasi", label: "Kelola Lokasi", icon: FiMap },
];

export default function ManageLocation() {
  const { user } = useAuth();
  const [existing, setExisting] = useState(undefined); // undefined = loading, null = none yet
  const [namaLokasi, setNamaLokasi] = useState("");
  const [alamat, setAlamat] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeResult, setGeocodeResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const tipe = user.role === "recycler" ? "recycling_center" : "repair_shop";

  useEffect(() => {
    api.dropoff
      .list({ partner_id: user.id })
      .then((points) => {
        const mine = points[0] || null;
        setExisting(mine);
        if (mine) {
          setNamaLokasi(mine.namaLokasi);
          setAlamat(mine.alamat || "");
          setLat(String(mine.latitude));
          setLon(String(mine.longitude));
        }
      })
      .catch((err) => setError(err.message));
  }, [user.id]);

  async function handleGeocode() {
    if (!alamat.trim()) return;
    setGeocoding(true);
    setError("");
    setGeocodeResult(null);
    try {
      const result = await geocodeAddress(alamat);
      if (!result) {
        setError("Alamat tidak ditemukan. Coba tulis lebih spesifik, atau isi koordinat manual di bawah.");
      } else {
        setLat(String(result.lat.toFixed(6)));
        setLon(String(result.lon.toFixed(6)));
        setGeocodeResult(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setGeocoding(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!namaLokasi.trim()) return setError("Isi nama lokasi.");
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    if (isNaN(latNum) || isNaN(lonNum)) return setError("Koordinat belum terisi — cari alamat dulu atau isi manual.");

    setSaving(true);
    try {
      const payload = {
        nama_lokasi: namaLokasi.trim(),
        latitude: latNum,
        longitude: lonNum,
        tipe,
        alamat: alamat.trim() || undefined,
      };
      const saved = existing ? await api.dropoff.update(existing.id, payload) : await api.dropoff.create(payload);
      setExisting(saved);
      setSuccess("Lokasi tersimpan dan langsung tampil di Peta Mitra.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageTransition>
      <DashboardShell navItems={NAV_ITEMS} sectionLabel="Menu Mitra">
        <div className="mb-7">
          <h1 className="text-[28px]">Kelola Lokasi</h1>
          <p className="text-ink-soft">
            {existing === undefined
              ? "Memuat…"
              : existing
              ? "Perbarui lokasi yang tampil untuk pemilik perangkat di Peta Mitra."
              : "Daftarkan lokasimu supaya muncul di Peta Mitra dan bisa dipilih pemilik perangkat."}
          </p>
        </div>

        {existing === undefined ? (
          <Skeleton className="h-[420px] rounded-md2 max-w-[560px]" />
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card max-w-[560px]"
          >
            {error && <div className="alert alert-error">{error}</div>}
            {success && (
              <div className="alert alert-success flex items-center gap-2">
                <FiCheckCircle /> {success}
              </div>
            )}

            <div className="field">
              <label htmlFor="namaLokasi">Nama Lokasi</label>
              <input
                id="namaLokasi"
                type="text"
                className="input"
                placeholder={user.role === "recycler" ? "mis. Rina Recycling Center" : "mis. Tono Repair Shop"}
                value={namaLokasi}
                onChange={(e) => setNamaLokasi(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="alamat">Alamat</label>
              <div className="flex gap-2">
                <input
                  id="alamat"
                  type="text"
                  className="input"
                  placeholder="Jl. Contoh No. 12, Kecamatan, Kota"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                />
                <Button type="button" variant="outline" loading={geocoding} onClick={handleGeocode}>
                  <FiSearch />
                </Button>
              </div>
              <p className="field-hint">
                Klik ikon cari untuk mengisi koordinat otomatis (via {geocodingProvider === "nominatim" ? "OpenStreetMap" : geocodingProvider}).
              </p>
              {geocodeResult && (
                <p className="text-xs text-signal-deep mt-1.5">Ditemukan: {geocodeResult.displayName}</p>
              )}
            </div>

            <div className="flex gap-4">
              <div className="field flex-1">
                <label htmlFor="lat">Latitude</label>
                <input id="lat" type="text" className="input" value={lat} onChange={(e) => setLat(e.target.value)} />
              </div>
              <div className="field flex-1">
                <label htmlFor="lon">Longitude</label>
                <input id="lon" type="text" className="input" value={lon} onChange={(e) => setLon(e.target.value)} />
              </div>
            </div>
            <p className="field-hint -mt-2 mb-4">
              Koordinat bisa diisi manual juga — misalnya dari Google Maps: klik kanan lokasi → salin koordinat.
            </p>

            <Button type="submit" block loading={saving}>
              {existing ? "Perbarui Lokasi" : "Simpan Lokasi"}
            </Button>

            {existing && (
              <Link to="/peta" className="btn btn-ghost btn-block mt-2.5">
                Lihat di Peta Mitra
              </Link>
            )}
          </motion.form>
        )}
      </DashboardShell>
    </PageTransition>
  );
}
