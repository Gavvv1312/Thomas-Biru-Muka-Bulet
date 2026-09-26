/**
 * The transaction lifecycle differs slightly by jalur (buyback has an extra
 * "ditawar" offer stage that recycle skips — recycling doesn't negotiate a
 * price, it just gets verified and completed). This is the single source
 * of truth for that lifecycle, used to render a stepper + plain-language
 * explanation of "what's happening right now and what happens next" on
 * both the owner and partner dashboards.
 */

export const BUYBACK_STAGES = [
  {
    key: "diajukan",
    label: "Diajukan",
    ownerText: "Pengajuanmu sudah terkirim. Menunggu teknisi meninjau kondisi perangkat dan mengirim tawaran harga.",
    partnerText: "Pengajuan baru masuk. Tinjau kondisi perangkat pada detail di bawah, lalu kirim tawaran harga.",
  },
  {
    key: "ditawar",
    label: "Ditawar",
    ownerText: "Teknisi sudah mengirim tawaran harga. Serahkan perangkat ke lokasi teknisi untuk diverifikasi fisik.",
    partnerText: "Tawaran sudah terkirim. Menunggu pemilik menyerahkan perangkat untuk kamu verifikasi.",
  },
  {
    key: "diverifikasi",
    label: "Diverifikasi",
    ownerText: "Kondisi fisik perangkat sudah diverifikasi teknisi. Menunggu pembayaran final diproses.",
    partnerText: "Verifikasi fisik selesai. Selesaikan transaksi untuk memproses pembayaran ke pemilik.",
  },
  {
    key: "selesai",
    label: "Selesai",
    ownerText: "Transaksi selesai — pembayaran sudah diproses oleh teknisi.",
    partnerText: "Transaksi selesai.",
  },
];

export const RECYCLE_STAGES = [
  {
    key: "diajukan",
    label: "Diajukan",
    ownerText: "Pengajuanmu sudah terkirim. Serahkan perangkat ke lokasi mitra daur ulang untuk diverifikasi.",
    partnerText: "Pengajuan baru masuk. Menunggu perangkat diserahkan untuk kamu verifikasi beratnya.",
  },
  {
    key: "diverifikasi",
    label: "Diverifikasi",
    ownerText: "Berat perangkat sudah diverifikasi. Menunggu Green Points diterbitkan ke akunmu.",
    partnerText: "Verifikasi berat selesai. Selesaikan transaksi untuk menerbitkan Green Points ke pemilik.",
  },
  {
    key: "selesai",
    label: "Selesai",
    ownerText: "Transaksi selesai — Green Points sudah ditambahkan ke akunmu.",
    partnerText: "Transaksi selesai.",
  },
];

export function getStages(jalur) {
  return jalur === "buyback" ? BUYBACK_STAGES : RECYCLE_STAGES;
}

export function getStageIndex(jalur, status) {
  return getStages(jalur).findIndex((s) => s.key === status);
}

/** Digits-only phone number, e.g. "+62 812-3456-7890" -> "6281234567890". */
export function normalizePhone(phone) {
  if (!phone) return "";
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  return digits;
}

export function waLink(phone) {
  const digits = normalizePhone(phone);
  return digits ? `https://wa.me/${digits}` : null;
}

export function telLink(phone) {
  const digits = normalizePhone(phone);
  return digits ? `tel:+${digits}` : null;
}
