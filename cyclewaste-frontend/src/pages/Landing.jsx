import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiSmartphone, FiTool, FiRefreshCw } from "react-icons/fi";
import PublicNavbar from "../components/layout/PublicNavbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import PageTransition from "../components/layout/PageTransition.jsx";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import LinkButton from "../components/ui/LinkButton.jsx";
import AuroraBlob from "../components/ui/AuroraBlob.jsx";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Landing() {
  return (
    <PageTransition>
      <PublicNavbar />

      {/* HERO */}
      <header className="pt-14 pb-10">
        <div className="max-w-[1160px] mx-auto px-6 grid md:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <motion.div initial="hidden" animate="show">
            <motion.p variants={fadeUp} custom={0} className="eyebrow font-display text-[13px] font-semibold text-moss">
              REUSE → REPAIR → RECYCLE
            </motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="text-[42px] sm:text-[56px] lg:text-[68px] mt-2">
              Elektronik bekasmu masih punya nilai.
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-ink-soft max-w-[52ch] mt-4">
              CycleWaste menghitung estimasi nilai perangkat elektronikmu, lalu menyalurkannya ke teknisi lokal
              untuk diperbaiki atau ke mitra daur ulang resmi — sebelum semuanya berakhir di TPA.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3 mt-8">
              <LinkButton to="/kalkulator" variant="signal">
                Cek Estimasi Nilai
              </LinkButton>
              <a href="#cara-kerja" className="btn btn-ghost">
                Lihat Cara Kerja
              </a>
            </motion.div>
            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-7 mt-10">
              {[
                ["2", "Jalur penyaluran"],
                ["≤2 mnt", "Estimasi nilai instan"],
                ["0 Rp", "Biaya cek nilai"],
              ].map(([value, label]) => (
                <div key={label}>
                  <div className="font-display text-[26px] font-bold text-moss-deep">{value}</div>
                  <span className="block text-xs text-ink-soft font-medium mt-0.5">{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-square"
          >
            <div className="absolute inset-0 rounded-full overflow-hidden border border-line bg-surface">
              <AuroraBlob />

              {/* A literal, labeled diagram — not decoration: one device,
                  valued, then routed down one of two clear paths. */}
              <div className="relative h-full flex flex-col items-center justify-center gap-5 px-10 text-center">
                <div className="w-[72px] h-[72px] rounded-2xl bg-surface border border-line shadow-card flex items-center justify-center">
                  <FiSmartphone className="w-8 h-8 text-moss" />
                </div>
                <span className="text-xs font-semibold text-ink-soft">Elektronik bekasmu, dinilai dalam ≤2 menit</span>

                <div className="flex items-center gap-3 text-line">
                  <span className="h-px w-10 bg-line" />
                  <span className="text-[10px] font-display font-semibold text-ink-soft tracking-wide">LALU</span>
                  <span className="h-px w-10 bg-line" />
                </div>

                <div className="flex gap-6">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-14 h-14 rounded-full bg-copper/15 border border-copper/40 flex items-center justify-center">
                      <FiTool className="w-5 h-5 text-copper-deep" />
                    </div>
                    <span className="text-[11px] font-display font-semibold text-copper-deep">Buyback</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-14 h-14 rounded-full bg-signal/15 border border-signal-deep/40 flex items-center justify-center">
                      <FiRefreshCw className="w-5 h-5 text-signal-deep" />
                    </div>
                    <span className="text-[11px] font-display font-semibold text-signal-deep">Daur Ulang</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              className="absolute top-[8%] left-0 bg-surface border border-line rounded-md2 px-4 py-3.5 shadow-card text-[13px]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              Estimasi nilai
              <strong className="block font-display text-lg text-moss-deep">Rp 180rb–260rb</strong>
            </motion.div>

            <motion.div
              className="absolute bottom-[10%] right-[2%] bg-surface border border-line rounded-md2 px-4 py-3.5 shadow-card text-[13px]"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              Green Points
              <strong className="block font-display text-lg text-signal-deep">+42 poin</strong>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* CARA KERJA */}
      <section id="cara-kerja" className="py-14">
        <div className="max-w-[1160px] mx-auto px-6">
          <p className="eyebrow font-display text-[13px] font-semibold text-moss">CARA KERJA</p>
          <h2 className="text-[32px] mt-2 max-w-[36ch]">
            Tiga langkah dari laci penyimpanan ke tangan yang tepat.
          </h2>

          <div className="grid md:grid-cols-3 mt-8 border border-line rounded-md2 bg-surface overflow-hidden">
            {[
              {
                step: "01 — Reuse",
                title: "Isi kondisi perangkat",
                body: "Pilih kategori, merek, tahun, dan kondisi komponen kunci (motherboard, layar, baterai). Semua dijawab lewat checklist singkat.",
              },
              {
                step: "02 — Repair / Recycle",
                title: "Terima rekomendasi jalur",
                body: "Sistem rule-based kami menghitung estimasi nilai atau estimasi berat & Green Points, lalu merekomendasikan jalur buyback atau daur ulang.",
              },
              {
                step: "03 — Serahkan",
                title: "Pilih mitra & serahkan",
                body: "Lihat teknisi atau titik drop-off terdekat di peta, ajukan transaksi, dan pantau statusnya sampai selesai.",
              },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={`p-7 ${i > 0 ? "md:border-l border-t md:border-t-0 border-line" : ""}`}
              >
                <div className="font-display text-[13px] font-bold text-copper-deep mb-3.5">{s.step}</div>
                <h3 className="text-xl mb-2">{s.title}</h3>
                <p className="text-ink-soft text-sm">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* JALUR */}
      <section id="jalur" className="py-14">
        <div className="max-w-[1160px] mx-auto px-6">
          <p className="eyebrow font-display text-[13px] font-semibold text-moss">DUA JALUR PENYALURAN</p>
          <h2 className="text-[32px] mt-2 max-w-[36ch]">
            Setiap perangkat direkomendasikan jalur yang paling masuk akal.
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {[
              {
                badge: "Jalur Buyback",
                variant: "buyback",
                bar: "bg-copper",
                title: "Motherboard atau layar masih berfungsi",
                body: "Perangkat disalurkan ke teknisi lokal untuk dikanibal sebagai spare part original — kamu dapat estimasi nilai dalam Rupiah, teknisi dapat komponen terjangkau.",
              },
              {
                badge: "Jalur Daur Ulang",
                variant: "recycle",
                bar: "bg-signal",
                title: "Mati total & komponen utama rusak",
                body: "Perangkat disalurkan ke mitra daur ulang resmi. Kamu dapat estimasi berat e-waste, rincian material, dan Green Points yang bisa dikumpulkan.",
              },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.12, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="rounded-md2 border border-line overflow-hidden bg-surface"
              >
                <div className={`h-1.5 ${c.bar}`} />
                <div className="p-6">
                  <span className={`badge ${c.variant === "buyback" ? "badge-buyback" : "badge-recycle"}`}>
                    <span className="badge-dot" />
                    {c.badge}
                  </span>
                  <h3 className="text-xl mt-3.5 mb-1.5">{c.title}</h3>
                  <p className="text-ink-soft text-sm">{c.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* UNTUK SIAPA */}
      <section id="mitra" className="py-14">
        <div className="max-w-[1160px] mx-auto px-6">
          <p className="eyebrow font-display text-[13px] font-semibold text-moss">UNTUK SIAPA</p>
          <h2 className="text-[32px] mt-2 max-w-[36ch]">Dibangun untuk tiga peran dalam satu rantai sirkular.</h2>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              {
                tag: "Masyarakat",
                title: "Pemilik Perangkat",
                items: ["Cek estimasi nilai tanpa biaya", "Pilih jual (buyback) atau donasi daur ulang", "Kumpulkan Green Points tiap transaksi"],
                cta: "Cek nilai perangkat →",
                to: "/kalkulator",
              },
              {
                tag: "Teknisi",
                title: "Repair Shop Lokal",
                items: ["Akses komponen kanibalan original", "Tinjau kondisi & tawar harga dari dashboard", "Verifikasi fisik saat barang diterima"],
                cta: "Login sebagai mitra →",
                to: "/login?role=partner",
              },
              {
                tag: "Recycler",
                title: "Fasilitas Daur Ulang",
                items: ["Pasokan e-waste yang sudah terpilah", "Info material transparan sebelum penerimaan", "Terbitkan Green Points otomatis ke pengguna"],
                cta: "Login sebagai mitra →",
                to: "/login?role=partner",
              },
            ].map((p, i) => (
              <Card key={p.title} hover className="flex flex-col gap-3.5">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="flex flex-col gap-3.5"
                >
                  <Badge>{p.tag}</Badge>
                  <h3 className="text-[21px]">{p.title}</h3>
                  <ul className="text-ink-soft text-sm flex flex-col gap-1.5 list-disc pl-[18px]">
                    {p.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                  <Link to={p.to} className="btn btn-outline btn-sm self-start mt-1">
                    {p.cta}
                  </Link>
                </motion.div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* BANNER */}
      <section className="py-14">
        <div className="max-w-[1160px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="bg-moss rounded-lg2 p-9 sm:p-14 flex flex-wrap justify-between items-center gap-8"
          >
            <div>
              <h2 className="text-white text-[32px] max-w-[20ch]">
                Setiap komponen yang diselamatkan adalah limbah B3 yang tidak sampai ke TPA.
              </h2>
              <p className="text-white/75 dark:text-white/90 mt-2.5 max-w-[46ch]">
                Mulai dari satu ponsel lama di laci — cek estimasi nilainya sekarang, gratis dan tanpa komitmen.
              </p>
            </div>
            <LinkButton to="/kalkulator" variant="signal">
              Cek Estimasi Nilai
            </LinkButton>
          </motion.div>
        </div>
      </section>

      <Footer />
    </PageTransition>
  );
}
