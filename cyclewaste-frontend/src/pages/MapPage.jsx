import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import PageTransition from "../components/layout/PageTransition.jsx";
import BrandMark from "../components/BrandMark.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import api from "../lib/api.js";
import { useAuth } from "../lib/AuthContext.jsx";
import { waLink } from "../data/transactionStages.js";

const FILTERS = [
  { key: "", label: "Semua" },
  { key: "repair_shop", label: "Teknisi" },
  { key: "recycling_center", label: "Daur Ulang" },
];

function makeIcon(color) {
  return L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export default function MapPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const mapRef = useRef(null);
  const [points, setPoints] = useState(null);
  const [error, setError] = useState("");
  const [filterKey, setFilterKey] = useState("");
  const isPartner = user.role === "teknisi" || user.role === "recycler";

  useEffect(() => {
    api.dropoff
      .list()
      .then(setPoints)
      .catch((err) => setError(err.message));
  }, []);

  const filtered = points ? (filterKey ? points.filter((p) => p.tipe === filterKey) : points) : [];

  function focusPoint(p) {
    if (mapRef.current) {
      mapRef.current.setView([p.latitude, p.longitude], 15);
    }
  }

  return (
    <PageTransition>
      <div className="h-screen grid md:grid-cols-[360px_1fr] overflow-hidden">
        <div className="border-r border-line p-5 overflow-y-auto bg-surface">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="flex items-center gap-2 font-display font-bold text-[15px] text-moss-deep">
              <BrandMark size={22} />
              CycleWaste
            </Link>
            <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm">
              ← Kembali
            </button>
          </div>

          <p className="eyebrow font-display text-[13px] font-semibold text-moss">PETA MITRA</p>
          <h1 className="text-xl my-1.5">Teknisi & titik daur ulang</h1>
          {isPartner && (
            <Link to="/mitra/lokasi" className="text-xs font-semibold text-moss-deep mb-3 inline-block">
              Kelola lokasiku →
            </Link>
          )}

          <div className="flex gap-2 mb-4">
            {FILTERS.map((f) => (
              <button
                key={f.label}
                onClick={() => setFilterKey(f.key)}
                className={`flex-1 border rounded-full py-2 px-1 text-xs font-semibold transition-colors ${
                  filterKey === f.key ? "bg-moss text-white border-moss" : "bg-surface text-ink-soft border-line"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex gap-5 text-xs mb-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: "#C9793F" }} />
              Repair Shop
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: "#7FA62A" }} />
              Recycling Center
            </span>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {!points && !error && (
            <div className="flex flex-col gap-2.5">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          )}

          {points && !filtered.length && (
            <div className="text-center text-ink-soft py-6 px-2">Belum ada titik terdaftar.</div>
          )}

          <div className="flex flex-col gap-2.5">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => focusPoint(p)}
                className="border border-line rounded-sm2 px-3.5 py-3 text-left hover:border-moss transition-colors"
              >
                <div className="font-semibold text-[13.5px]">{p.namaLokasi}</div>
                <div className="text-xs text-ink-soft mt-0.5">
                  {p.tipe === "repair_shop" ? "Repair Shop" : "Recycling Center"}
                  {p.partner ? ` · ${p.partner.nama}` : ""}
                </div>
                {p.alamat && <div className="text-xs text-ink-soft mt-0.5">{p.alamat}</div>}
              </button>
            ))}
          </div>
        </div>

        <MapContainer center={[-6.95, 109.24]} zoom={11} ref={mapRef} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((p) => (
            <Marker
              key={p.id}
              position={[p.latitude, p.longitude]}
              icon={makeIcon(p.tipe === "repair_shop" ? "#C9793F" : "#7FA62A")}
            >
              <Popup>
                <strong>{p.namaLokasi}</strong>
                <br />
                {p.tipe === "repair_shop" ? "Repair Shop" : "Recycling Center"}
                {p.partner ? (
                  <>
                    <br />
                    Mitra: {p.partner.nama}
                  </>
                ) : null}
                {p.alamat ? (
                  <>
                    <br />
                    {p.alamat}
                  </>
                ) : null}
                {p.partner?.telepon ? (
                  <>
                    <br />
                    <a href={waLink(p.partner.telepon)} target="_blank" rel="noreferrer">
                      WhatsApp mitra
                    </a>
                  </>
                ) : null}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </PageTransition>
  );
}
