import { FiPhone, FiMessageCircle, FiCheck } from "react-icons/fi";
import Modal from "./ui/Modal.jsx";
import { StatusBadge, ChannelBadge } from "./ui/Badge.jsx";
import { getStages, getStageIndex, waLink, telLink } from "../data/transactionStages.js";

function idr(n) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

/**
 * perspective: "owner" | "partner" — picks which explanation text to show
 * and whether to render the partner contact card (owner-only; a partner
 * already knows who they're talking to and doesn't need their own contact
 * card shown back to them).
 */
export default function TransactionDetailModal({ transaction: t, open, onClose, perspective = "owner" }) {
  if (!t) return null;

  const stages = getStages(t.jalur);
  const currentIndex = getStageIndex(t.jalur, t.status);
  const isCancelled = t.status === "dibatalkan";
  const partner = t.partner;
  const deviceLabel = t.device ? `${t.device.merek} ${t.device.tipe}` : "Perangkat";

  return (
    <Modal open={open} onClose={onClose} size="lg" title={deviceLabel}>
      <div className="flex items-center gap-2 mb-5 -mt-2">
        <ChannelBadge jalur={t.jalur} />
        <StatusBadge status={t.status} />
      </div>

      {isCancelled ? (
        <div className="rounded-md2 border border-danger/30 bg-danger/10 px-4 py-3.5 text-sm text-danger mb-6">
          Transaksi ini telah dibatalkan.
        </div>
      ) : (
        <div className="mb-6">
          {/* Stepper */}
          <div className="flex items-center mb-4">
            {stages.map((stage, i) => {
              const isDone = i < currentIndex;
              const isCurrent = i === currentIndex;
              return (
                <div key={stage.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                        isDone
                          ? "bg-signal-deep border-signal-deep text-white"
                          : isCurrent
                          ? "bg-moss border-moss text-white"
                          : "bg-surface border-line text-ink-soft"
                      }`}
                    >
                      {isDone ? <FiCheck size={14} /> : i + 1}
                    </div>
                    <span
                      className={`text-[11px] font-semibold whitespace-nowrap ${
                        isCurrent ? "text-moss-deep" : "text-ink-soft"
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                  {i < stages.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1.5 rounded-full ${isDone ? "bg-signal-deep" : "bg-line"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Plain-language explanation of the current stage */}
          {currentIndex > -1 && (
            <div className="rounded-md2 border border-line bg-paper px-4 py-3.5 text-sm">
              {perspective === "owner" ? stages[currentIndex].ownerText : stages[currentIndex].partnerText}
            </div>
          )}
        </div>
      )}

      {/* Values */}
      <div className="mb-6">
        <p className="text-[13px] font-semibold mb-2.5">Rincian nilai</p>
        <div className="flex flex-col">
          {t.hargaTawar && (
            <div className="flex justify-between py-2 border-b border-line text-[13.5px]">
              <span className="text-ink-soft">Tawaran teknisi</span>
              <strong>{idr(t.hargaTawar)}</strong>
            </div>
          )}
          {t.hargaFinal && (
            <div className="flex justify-between py-2 border-b border-line text-[13.5px] last:border-b-0">
              <span className="text-ink-soft">Harga final</span>
              <strong className="text-moss-deep">{idr(t.hargaFinal)}</strong>
            </div>
          )}
          {t.verifiedWeightGrams && (
            <div className="flex justify-between py-2 border-b border-line text-[13.5px] last:border-b-0">
              <span className="text-ink-soft">Berat terverifikasi</span>
              <strong>{(t.verifiedWeightGrams / 1000).toFixed(1)} kg</strong>
            </div>
          )}
          {t.verificationNotes && (
            <div className="flex justify-between py-2 border-b border-line text-[13.5px] last:border-b-0 gap-4">
              <span className="text-ink-soft flex-shrink-0">Catatan verifikasi</span>
              <span className="text-right">{t.verificationNotes}</span>
            </div>
          )}
          {!t.hargaTawar && !t.hargaFinal && !t.verifiedWeightGrams && t.device?.valuation && (
            <div className="flex justify-between py-2 text-[13.5px]">
              <span className="text-ink-soft">Estimasi awal</span>
              <strong>
                {t.jalur === "buyback"
                  ? `${idr(t.device.valuation.estimasiNilaiMin)}–${idr(t.device.valuation.estimasiNilaiMax)}`
                  : `${(t.device.estimatedWeightGrams / 1000).toFixed(1)} kg`}
              </strong>
            </div>
          )}
        </div>
      </div>

      {/* Partner contact — owner-facing only */}
      {perspective === "owner" && partner && (
        <div>
          <p className="text-[13px] font-semibold mb-2.5">
            {t.jalur === "buyback" ? "Kontak Teknisi" : "Kontak Mitra Daur Ulang"}
          </p>
          <div className="rounded-md2 border border-line bg-paper px-4 py-3.5">
            <div className="font-semibold text-sm">{partner.nama}</div>
            <div className="text-xs text-ink-soft mb-3">{partner.role === "teknisi" ? "Teknisi" : "Recycler"}</div>
            {partner.telepon ? (
              <div className="flex gap-2 flex-wrap">
                <a href={telLink(partner.telepon)} className="btn btn-outline btn-sm inline-flex items-center gap-1.5">
                  <FiPhone size={14} /> Telepon
                </a>
                <a
                  href={waLink(partner.telepon)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-signal btn-sm inline-flex items-center gap-1.5"
                >
                  <FiMessageCircle size={14} /> WhatsApp
                </a>
              </div>
            ) : (
              <p className="text-xs text-ink-soft">Nomor kontak belum tersedia — cek Peta Mitra untuk info lokasi.</p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
