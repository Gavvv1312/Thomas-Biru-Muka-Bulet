import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiGrid, FiMap } from "react-icons/fi";
import DashboardShell from "../components/layout/DashboardShell.jsx";
import PageTransition from "../components/layout/PageTransition.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import Modal from "../components/ui/Modal.jsx";
import Button from "../components/ui/Button.jsx";
import { StatusBadge, ChannelBadge } from "../components/ui/Badge.jsx";
import TransactionDetailModal from "../components/TransactionDetailModal.jsx";
import { useAuth } from "../lib/AuthContext.jsx";
import api from "../lib/api.js";

const NAV_ITEMS = [
  { to: "/mitra", label: "Transaksi Masuk", icon: FiGrid },
  { to: "/peta", label: "Lihat Peta Mitra", icon: FiMap },
  { to: "/mitra/lokasi", label: "Kelola Lokasi", icon: FiMap },
];

const FILTERS = [
  { key: "active", label: "Aktif" },
  { key: "selesai", label: "Selesai" },
  { key: "dibatalkan", label: "Dibatalkan" },
  { key: "all", label: "Semua" },
];

function idr(n) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

// Shows the real negotiated/verified figure once one exists; otherwise falls
// back to the original calculator estimate (device.valuation) so partners
// and owners aren't staring at "—" before an offer has been made.
function valueDisplay(t) {
  if (t.hargaFinal) return idr(t.hargaFinal);
  if (t.verifiedWeightGrams) return `${(t.verifiedWeightGrams / 1000).toFixed(1)} kg (terverifikasi)`;
  if (t.hargaTawar) return `${idr(t.hargaTawar)} (tawaran)`;

  const valuation = t.device?.valuation;
  if (valuation && t.jalur === "buyback") {
    return `${idr(valuation.estimasiNilaiMin)}–${idr(valuation.estimasiNilaiMax)} (estimasi)`;
  }
  if (t.device?.estimatedWeightGrams && t.jalur === "recycle") {
    return `${(t.device.estimatedWeightGrams / 1000).toFixed(1)} kg (estimasi)`;
  }
  return "—";
}

export default function PartnerDashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("active");
  const [modal, setModal] = useState(null); // { action, id, jalur }
  const [modalError, setModalError] = useState("");
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalFields, setModalFields] = useState({});
  const [selectedTx, setSelectedTx] = useState(null);

  function loadTransactions() {
    api.transactions
      .list()
      .then(setTransactions)
      .catch((err) => setError(err.message));
  }

  useEffect(loadTransactions, []);

  const stats = transactions
    ? {
        newCount: transactions.filter((t) => t.status === "diajukan").length,
        pendingVerify: transactions.filter(
          (t) => (t.status === "ditawar" && t.jalur === "buyback") || (t.status === "diajukan" && t.jalur === "recycle")
        ).length,
        ongoing: transactions.filter((t) => t.status === "diverifikasi").length,
        walletBalance: transactions
          .filter((t) => t.status === "selesai" && t.jalur === "buyback" && t.hargaFinal)
          .reduce((sum, t) => sum + t.hargaFinal, 0),
      }
    : null;

  const filtered = transactions
    ? transactions.filter((t) => {
        if (filter === "all") return true;
        if (filter === "active") return ["diajukan", "ditawar", "diverifikasi"].includes(t.status);
        return t.status === filter;
      })
    : [];

  function openModal(action, tx) {
    setModal({ action, id: tx.id, jalur: tx.jalur });
    setModalFields({});
    setModalError("");
  }

  async function handleModalSubmit() {
    setModalSubmitting(true);
    setModalError("");
    try {
      if (modal.action === "offer") {
        await api.transactions.makeOffer(modal.id, Number(modalFields.harga));
      } else if (modal.action === "verify") {
        await api.transactions.verify(modal.id, Number(modalFields.berat), modalFields.catatan || undefined);
      } else if (modal.action === "complete") {
        await api.transactions.complete(modal.id, modal.jalur === "buyback" ? Number(modalFields.final) : undefined);
      }
      setModal(null);
      loadTransactions();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setModalSubmitting(false);
    }
  }

  async function handleCancel(id) {
    if (!window.confirm("Batalkan transaksi ini?")) return;
    try {
      await api.transactions.cancel(id);
      loadTransactions();
    } catch (err) {
      window.alert(err.message);
    }
  }

  async function handleCompleteRecycle(id) {
    try {
      await api.transactions.complete(id);
      loadTransactions();
    } catch (err) {
      window.alert(err.message);
    }
  }

  return (
    <PageTransition>
      <DashboardShell navItems={NAV_ITEMS} sectionLabel="Menu Mitra">
        <div className="flex justify-between items-start gap-5 flex-wrap mb-6">
          <div>
            <h1 className="text-[28px]">Welcome, {user.nama.split(" ")[0]}!</h1>
            <p className="text-ink-soft">
              {user.role === "recycler"
                ? "Kelola pengajuan daur ulang yang masuk ke fasilitasmu."
                : "Kelola pengajuan buyback yang masuk ke bengkelmu."}
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-moss text-white rounded-lg2 px-8 py-7 mb-7"
        >
          <h2 className="text-white text-[22px]">Antrean transaksi butuh tindakanmu</h2>
          <p className="text-white/75 mt-1.5 max-w-[60ch]">
            Tawar harga, verifikasi kondisi fisik saat barang tiba, lalu selesaikan transaksi untuk menerbitkan
            Green Points atau pembayaran.
          </p>
        </motion.div>

        {error && <div className="alert alert-error">{error}</div>}

        {!stats && !error && (
          <div className="grid md:grid-cols-4 gap-5 mb-7">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[90px]" />
            ))}
          </div>
        )}

        {stats && (
          <div className="grid md:grid-cols-4 gap-5 mb-7">
            {[
              ["Pengajuan baru", stats.newCount],
              ["Menunggu verifikasi", stats.pendingVerify],
              ["Transaksi berjalan", stats.ongoing],
              ["Saldo E-Wallet", idr(stats.walletBalance)],
            ].map(([label, value], i) => (
              <motion.div
                key={label}
                className="stat-card"
                whileHover={{ y: -3 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="text-[13px] text-ink-soft mb-2.5">{label}</div>
                <div className="font-display text-[26px] font-bold text-moss-deep">{value}</div>
                {label === "Saldo E-Wallet" && (
                  <div className="text-[11px] text-ink-soft mt-1">dari transaksi buyback selesai</div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex gap-2 flex-wrap mb-5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`border rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                filter === f.key ? "bg-moss text-white border-moss" : "bg-surface text-ink-soft border-line"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {!transactions && !error && <Skeleton className="h-[220px] rounded-md2" />}

        {transactions && (
          <>
            {!filtered.length ? (
              <div className="card text-center text-ink-soft py-10">
                <h3 className="text-ink mb-1.5">Tidak ada transaksi</h3>
                <p>Belum ada pengajuan pada kategori ini.</p>
              </div>
            ) : (
              <div className="border border-line rounded-md2 bg-surface overflow-x-auto">
                <table className="table w-full text-sm min-w-[720px]">
                  <thead>
                    <tr>
                      <th>Pemilik</th>
                      <th>Perangkat</th>
                      <th>Jalur</th>
                      <th>Status</th>
                      <th>Nilai / Berat</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((t) => (
                      <tr key={t.id}>
                        <td>{t.user?.nama || "-"}</td>
                        <td>{t.device ? `${t.device.merek} ${t.device.tipe}` : "-"}</td>
                        <td>
                          <ChannelBadge jalur={t.jalur} />
                        </td>
                        <td>
                          <StatusBadge status={t.status} />
                        </td>
                        <td>{valueDisplay(t)}</td>
                        <td>
                          <div className="flex gap-2 flex-wrap">
                            <Button size="sm" variant="ghost" onClick={() => setSelectedTx(t)}>
                              Lihat Proses
                            </Button>
                            {t.status === "diajukan" && t.jalur === "buyback" && (
                              <Button size="sm" variant="outline" onClick={() => openModal("offer", t)}>
                                Tawar Harga
                              </Button>
                            )}
                            {((t.status === "ditawar" && t.jalur === "buyback") ||
                              (t.status === "diajukan" && t.jalur === "recycle")) && (
                              <Button size="sm" variant="outline" onClick={() => openModal("verify", t)}>
                                Verifikasi Fisik
                              </Button>
                            )}
                            {t.status === "diverifikasi" && t.jalur === "buyback" && (
                              <Button size="sm" variant="signal" onClick={() => openModal("complete", t)}>
                                Selesaikan
                              </Button>
                            )}
                            {t.status === "diverifikasi" && t.jalur === "recycle" && (
                              <Button size="sm" variant="signal" onClick={() => handleCompleteRecycle(t.id)}>
                                Selesaikan
                              </Button>
                            )}
                            {["diajukan", "ditawar", "diverifikasi"].includes(t.status) && (
                              <Button size="sm" variant="danger-ghost" onClick={() => handleCancel(t.id)}>
                                Batalkan
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </DashboardShell>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={
          modal?.action === "offer" ? "Tawar Harga" : modal?.action === "verify" ? "Verifikasi Fisik" : "Selesaikan Transaksi"
        }
        subtitle={
          modal?.action === "offer"
            ? "Ajukan harga tawaran untuk transaksi ini."
            : modal?.action === "verify"
            ? "Masukkan hasil pemeriksaan fisik saat barang diterima."
            : "Masukkan harga final yang dibayarkan ke pemilik perangkat."
        }
      >
        {modal?.action === "offer" && (
          <div className="field">
            <label>Harga Tawar (Rp)</label>
            <input
              type="number"
              className="input"
              placeholder="150000"
              value={modalFields.harga || ""}
              onChange={(e) => setModalFields((f) => ({ ...f, harga: e.target.value }))}
            />
          </div>
        )}
        {modal?.action === "verify" && (
          <>
            <div className="field">
              <label>Berat Terverifikasi (gram)</label>
              <input
                type="number"
                className="input"
                placeholder="180"
                value={modalFields.berat || ""}
                onChange={(e) => setModalFields((f) => ({ ...f, berat: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Catatan (opsional)</label>
              <input
                type="text"
                className="input"
                placeholder="Kondisi sesuai deskripsi"
                value={modalFields.catatan || ""}
                onChange={(e) => setModalFields((f) => ({ ...f, catatan: e.target.value }))}
              />
            </div>
          </>
        )}
        {modal?.action === "complete" && (
          <div className="field">
            <label>Harga Final (Rp)</label>
            <input
              type="number"
              className="input"
              placeholder="180000"
              value={modalFields.final || ""}
              onChange={(e) => setModalFields((f) => ({ ...f, final: e.target.value }))}
            />
          </div>
        )}

        {modalError && <div className="alert alert-error">{modalError}</div>}

        <div className="flex gap-2.5 mt-2">
          <Button variant="ghost" block onClick={() => setModal(null)}>
            Batal
          </Button>
          <Button block loading={modalSubmitting} onClick={handleModalSubmit}>
            Simpan
          </Button>
        </div>
      </Modal>

      <TransactionDetailModal
        transaction={selectedTx}
        open={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        perspective="partner"
      />
    </PageTransition>
  );
}
