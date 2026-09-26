import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiGrid, FiSmartphone, FiMap } from "react-icons/fi";
import DashboardShell from "../components/layout/DashboardShell.jsx";
import PageTransition from "../components/layout/PageTransition.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import LinkButton from "../components/ui/LinkButton.jsx";
import { StatusBadge, ChannelBadge } from "../components/ui/Badge.jsx";
import TransactionDetailModal from "../components/TransactionDetailModal.jsx";
import { useAuth } from "../lib/AuthContext.jsx";
import api from "../lib/api.js";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/kalkulator", label: "Cek Estimasi Baru", icon: FiSmartphone },
  { to: "/peta", label: "Peta Mitra", icon: FiMap },
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

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [selectedTx, setSelectedTx] = useState(null);

  useEffect(() => {
    api.users
      .dashboard(user.id)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [user.id]);

  return (
    <PageTransition>
      <DashboardShell navItems={NAV_ITEMS}>
        <div className="flex justify-between items-start gap-5 flex-wrap mb-8">
          <div>
            <h1 className="text-[28px]">Welcome, {user.nama.split(" ")[0]}!</h1>
            <p className="text-ink-soft">Ringkasan kontribusimu di rantai sirkular CycleWaste.</p>
          </div>
          <LinkButton to="/kalkulator" variant="signal">
            + Cek Estimasi Baru
          </LinkButton>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {!data && !error && (
          <div className="flex flex-col gap-5">
            <Skeleton className="h-[110px] rounded-lg2" />
            <div className="grid md:grid-cols-3 gap-5">
              <Skeleton className="h-[90px]" />
              <Skeleton className="h-[90px]" />
              <Skeleton className="h-[90px]" />
            </div>
          </div>
        )}

        {data && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
            <div className="bg-moss text-white rounded-lg2 px-9 py-8 flex flex-wrap justify-between items-center gap-5 mb-7">
              <div>
                <div className="text-[13px] text-white/75">Total Green Points</div>
                <div className="font-display text-[40px] font-bold mt-1">{data.poinHijau.toLocaleString("id-ID")}</div>
              </div>
              <div className="flex gap-8">
                <div>
                  <div className="text-[13px] text-white/75">Unit diselamatkan</div>
                  <div className="font-display text-[22px] font-bold mt-1">{data.totalCompletedTransactions}</div>
                </div>
                <div>
                  <div className="text-[13px] text-white/75">E-waste terhindar dari TPA</div>
                  <div className="font-display text-[22px] font-bold mt-1">
                    {(data.totalVerifiedEwasteWeightGrams / 1000).toFixed(1)} kg
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5 mb-8">
              {[
                ["Perangkat terdaftar", data.totalDevices],
                ["Transaksi buyback selesai", data.totalBuyback],
                ["Transaksi daur ulang selesai", data.totalRecycle],
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
                  <div className="font-display text-[28px] font-bold text-moss-deep">{value}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-7">
              <div>
                <div className="flex items-baseline justify-between mb-3.5">
                  <h2 className="text-lg">Transaksi Terbaru</h2>
                  {!!data.latestTransactions.length && (
                    <span className="text-xs text-ink-soft">Klik baris untuk detail & kontak mitra</span>
                  )}
                </div>
                {!data.latestTransactions.length ? (
                  <div className="card text-center text-ink-soft py-10">
                    <h3 className="text-ink mb-1.5">Belum ada transaksi</h3>
                    <p>Mulai dengan cek estimasi nilai perangkatmu.</p>
                  </div>
                ) : (
                  <div className="border border-line rounded-md2 bg-surface overflow-x-auto">
                    <table className="table w-full text-sm">
                      <thead>
                        <tr>
                          <th>Perangkat</th>
                          <th>Jalur</th>
                          <th>Status</th>
                          <th>Nilai</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.latestTransactions.map((t) => (
                          <tr
                            key={t.id}
                            onClick={() => setSelectedTx(t)}
                            className="cursor-pointer hover:bg-paper-dim transition-colors"
                          >
                            <td>{t.device ? `${t.device.merek} ${t.device.tipe}` : "-"}</td>
                            <td>
                              <ChannelBadge jalur={t.jalur} />
                            </td>
                            <td>
                              <StatusBadge status={t.status} />
                            </td>
                            <td>{valueDisplay(t)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-lg mb-3.5">Riwayat Green Points</h2>
                {!data.latestPointsHistory.length ? (
                  <div className="card text-center text-ink-soft py-10">
                    <h3 className="text-ink mb-1.5">Belum ada poin</h3>
                    <p>Selesaikan transaksi daur ulang untuk dapat Green Points.</p>
                  </div>
                ) : (
                  <div className="card px-5 py-1">
                    {data.latestPointsHistory.map((p) => (
                      <div key={p.id} className="flex justify-between py-2.5 border-b border-line text-[13.5px] last:border-b-0">
                        <span className="text-ink-soft">
                          {new Date(p.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          · {p.source}
                        </span>
                        <strong className="text-moss-deep">+{p.amount}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </DashboardShell>

      <TransactionDetailModal
        transaction={selectedTx}
        open={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        perspective="owner"
      />
    </PageTransition>
  );
}
