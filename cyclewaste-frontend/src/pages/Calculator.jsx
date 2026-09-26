import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "../components/layout/PageTransition.jsx";
import PublicNavbar from "../components/layout/PublicNavbar.jsx";
import CategoryIcon from "../components/CategoryIcon.jsx";
import StepDots from "../components/ui/StepDots.jsx";
import Button from "../components/ui/Button.jsx";
import { CATEGORIES, CONDITIONS, getCategory } from "../data/valuationData.js";
import { useAuth } from "../lib/AuthContext.jsx";
import api from "../lib/api.js";

const DRAFT_KEY = "cw_calc_draft";
const TOTAL_STEPS = 5;

function loadDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw
      ? JSON.parse(raw)
      : { kategori: null, merek: "", tipe: "", tahun_rilis: "", estimated_weight_grams: "", components: {} };
  } catch {
    return { kategori: null, merek: "", tipe: "", tahun_rilis: "", estimated_weight_grams: "", components: {} };
  }
}

function idr(n) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

const slideVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export default function Calculator() {
  const [searchParams] = useSearchParams();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(loadDraft);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [deviceId, setDeviceId] = useState(null);
  const [valuation, setValuation] = useState(null);
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [txSubmitting, setTxSubmitting] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draft]);

  useEffect(() => {
    if (searchParams.get("resume") === "1" && isLoggedIn && draft.kategori) {
      setStep(4);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateDraft(patch) {
    setDraft((d) => ({ ...d, ...patch }));
  }

  function setComponentCondition(componentId, conditionId) {
    setDraft((d) => ({ ...d, components: { ...d.components, [componentId]: conditionId } }));
  }

  function validateStep(n) {
    if (n === 1 && !draft.kategori) return "Pilih kategori perangkat dulu.";
    if (n === 2) {
      if (!draft.merek.trim() || !draft.tipe.trim()) return "Isi merek dan tipe perangkat.";
      if (!draft.tahun_rilis || Number(draft.tahun_rilis) < 1990) return "Isi tahun rilis yang valid.";
      if (!draft.estimated_weight_grams || Number(draft.estimated_weight_grams) <= 0)
        return "Isi estimasi berat yang valid.";
    }
    if (n === 3) {
      const cat = getCategory(draft.kategori);
      const missing = cat.components.some((c) => !draft.components[c.id]);
      if (missing) return "Isi kondisi untuk semua komponen.";
    }
    return null;
  }

  function goNext() {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    if (step === 4) {
      submitForValuation();
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitForValuation() {
    if (!isLoggedIn) {
      navigate("/login?next=%2Fkalkulator");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const componentsPayload = Object.keys(draft.components).map((key) => ({
        nama_komponen: key,
        kondisi: draft.components[key],
      }));

      const device = await api.devices.create({
        kategori: draft.kategori,
        merek: draft.merek,
        tipe: draft.tipe,
        tahun_rilis: parseInt(draft.tahun_rilis, 10),
        estimated_weight_grams: parseInt(draft.estimated_weight_grams, 10),
        components: componentsPayload,
      });
      setDeviceId(device.id);

      const result = await api.devices.createValuation(device.id);
      setValuation(result);
      sessionStorage.removeItem(DRAFT_KEY);

      const points = await api.dropoff.list({
        tipe: result.jalurRekomendasi === "buyback" ? "repair_shop" : "recycling_center",
      });
      setPartners(points);
      setStep(5);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function submitTransaction() {
    if (!selectedPartner) return;
    setTxSubmitting(true);
    setError("");
    try {
      await api.transactions.create({
        device_id: deviceId,
        partner_id: selectedPartner.partnerId,
        jalur: valuation.jalurRekomendasi,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      setTxSubmitting(false);
    }
  }

  const category = getCategory(draft.kategori);

  return (
    <PageTransition>
      <PublicNavbar />
      <div className="py-10 pb-24">
        <div className="max-w-[720px] mx-auto px-6">
          <div className="flex justify-between items-center mb-7">
            <div>
              <p className="eyebrow font-display text-[13px] font-semibold text-moss">CEK ESTIMASI NILAI</p>
              <h1 className="text-[26px] mt-1.5">Estimasi indikatif dalam beberapa langkah</h1>
            </div>
          </div>

          {step < 5 && <StepDots total={TOTAL_STEPS} current={step} />}

          <div className="card overflow-hidden">
            {error && <div className="alert alert-error">{error}</div>}

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 1 && (
                  <div>
                    <h2 className="text-lg mb-1">Pilih kategori perangkat</h2>
                    <p className="text-ink-soft text-sm mb-5">
                      Kategori menentukan daftar komponen yang akan kami tanyakan.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {CATEGORIES.map((cat) => (
                        <motion.button
                          key={cat.id}
                          type="button"
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            updateDraft({
                              kategori: cat.id,
                              estimated_weight_grams: draft.estimated_weight_grams || cat.weightHint,
                              components: {},
                            })
                          }
                          className={`border rounded-md2 p-5 text-center bg-surface transition-colors ${
                            draft.kategori === cat.id ? "border-moss bg-signal/15" : "border-line hover:border-moss"
                          }`}
                        >
                          <CategoryIcon id={cat.id} className="w-[34px] h-[34px] mx-auto mb-2.5 text-moss" />
                          <div className="font-semibold text-sm">{cat.label}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-lg mb-5">Detail perangkat</h2>
                    <div className="field mb-4">
                      <label htmlFor="merek">Merek</label>
                      <input
                        id="merek"
                        type="text"
                        className="input"
                        placeholder="mis. Samsung, Dell, Apple"
                        value={draft.merek}
                        onChange={(e) => updateDraft({ merek: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="field flex-1">
                        <label htmlFor="tipe">Tipe / Model</label>
                        <input
                          id="tipe"
                          type="text"
                          className="input"
                          placeholder="mis. Galaxy A52, Latitude 3420"
                          value={draft.tipe}
                          onChange={(e) => updateDraft({ tipe: e.target.value })}
                        />
                      </div>
                      <div className="field flex-1">
                        <label htmlFor="tahun">Tahun Rilis</label>
                        <input
                          id="tahun"
                          type="number"
                          min={1990}
                          className="input"
                          placeholder="mis. 2021"
                          value={draft.tahun_rilis}
                          onChange={(e) => updateDraft({ tahun_rilis: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="field mt-4">
                      <label htmlFor="berat">Estimasi Berat (gram)</label>
                      <input
                        id="berat"
                        type="number"
                        min={1}
                        className="input"
                        placeholder="mis. 180"
                        value={draft.estimated_weight_grams}
                        onChange={(e) => updateDraft({ estimated_weight_grams: e.target.value })}
                      />
                      <p className="field-hint">
                        Perkiraan saja — teknisi/recycler akan memverifikasi berat fisik saat penerimaan.
                      </p>
                    </div>
                  </div>
                )}

                {step === 3 && category && (
                  <div>
                    <h2 className="text-lg mb-1">Kondisi komponen kunci</h2>
                    <p className="text-ink-soft text-sm mb-5">
                      Jawab sejujurnya — ini menentukan jalur & estimasi nilai yang kamu terima.
                    </p>
                    <div className="flex flex-col gap-3">
                      {category.components.map((comp) => (
                        <div key={comp.id} className="border border-line rounded-md2 p-4 bg-surface">
                          <div className="font-display font-semibold mb-3">{comp.label}</div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {CONDITIONS.map((cond) => (
                              <button
                                key={cond.id}
                                type="button"
                                title={cond.hint}
                                onClick={() => setComponentCondition(comp.id, cond.id)}
                                className={`border rounded-sm2 py-2.5 px-2 text-center text-[12.5px] font-semibold transition-colors ${
                                  draft.components[comp.id] === cond.id
                                    ? "border-moss bg-moss text-white"
                                    : "border-line bg-white text-ink-soft hover:border-moss"
                                }`}
                              >
                                {cond.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && category && (
                  <div>
                    <h2 className="text-lg mb-5">Tinjau sebelum menghitung</h2>
                    <div className="flex flex-col">
                      {[
                        ["Kategori", category.label],
                        ["Merek / Tipe", `${draft.merek || "-"} / ${draft.tipe || "-"}`],
                        ["Tahun Rilis", draft.tahun_rilis || "-"],
                        ["Estimasi Berat", `${draft.estimated_weight_grams || "-"} gram`],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between py-2.5 border-b border-line text-[13.5px]">
                          <span className="text-ink-soft">{label}</span>
                          <strong>{value}</strong>
                        </div>
                      ))}
                      <div className="h-px bg-line my-4" />
                      {category.components.map((comp) => (
                        <div
                          key={comp.id}
                          className="flex justify-between py-2.5 border-b border-line text-[13.5px] last:border-b-0"
                        >
                          <span className="text-ink-soft">{comp.label}</span>
                          <strong>
                            {CONDITIONS.find((c) => c.id === draft.components[comp.id])?.label || "Belum diisi"}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 5 && valuation && (
                  <ResultsStep
                    valuation={valuation}
                    draft={draft}
                    partners={partners}
                    selectedPartner={selectedPartner}
                    onSelectPartner={setSelectedPartner}
                    onSubmitTransaction={submitTransaction}
                    txSubmitting={txSubmitting}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {step < 5 && (
              <div className="flex justify-between mt-7">
                <Button type="button" variant="ghost" onClick={goBack} className={step === 1 ? "invisible" : ""}>
                  ← Kembali
                </Button>
                <Button type="button" onClick={goNext} loading={submitting}>
                  {submitting ? "Menghitung…" : step === 4 ? "Hitung Estimasi →" : "Lanjut →"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function ResultsStep({
  valuation,
  draft,
  partners,
  selectedPartner,
  onSelectPartner,
  onSubmitTransaction,
  txSubmitting,
}) {
  const isBuyback = valuation.jalurRekomendasi === "buyback";
  const weightKg = (parseInt(draft.estimated_weight_grams, 10) / 1000).toFixed(2);
  const points = Math.floor(parseInt(draft.estimated_weight_grams, 10) / 100);

  return (
    <div>
      <div className="text-center py-2 pb-6">
        <span className={`badge ${isBuyback ? "badge-buyback" : "badge-recycle"}`}>
          <span className="badge-dot" />
          {isBuyback ? "Direkomendasikan: Jalur Buyback" : "Direkomendasikan: Jalur Daur Ulang"}
        </span>
        {isBuyback ? (
          <>
            <div className="font-display text-[42px] font-bold text-moss-deep mt-1.5">
              {idr(valuation.estimasiNilaiMin)} – {idr(valuation.estimasiNilaiMax)}
            </div>
            <p className="text-ink-soft mt-1.5">Estimasi nilai indikatif untuk teknisi</p>
          </>
        ) : (
          <>
            <div className="font-display text-[42px] font-bold text-moss-deep mt-1.5">~{points} Green Points</div>
            <p className="text-ink-soft mt-1.5">Estimasi dari {weightKg} kg e-waste (final setelah verifikasi berat)</p>
          </>
        )}
      </div>

      <div className="card bg-paper mb-5">
        <p className="text-[13px] font-semibold mb-2.5">Rincian per komponen</p>
        {(valuation.breakdown || []).map((b, i) => (
          <div key={i} className="flex justify-between py-2.5 border-b border-line text-[13.5px] last:border-b-0">
            <span className="text-ink-soft">
              {b.namaKomponen || b.nama_komponen} ({b.kondisi})
            </span>
            <strong>{idr(b.nilaiKomponen != null ? b.nilaiKomponen : b.nilai_komponen)}</strong>
          </div>
        ))}
      </div>

      <p className="text-ink-soft text-xs mb-6">{valuation.disclaimer}</p>

      <h3 className="text-[17px] mb-1">Pilih {isBuyback ? "teknisi" : "mitra daur ulang"} terdekat</h3>
      <p className="text-ink-soft text-sm mb-4">
        Atau{" "}
        <Link to="/peta" className="text-moss-deep font-semibold">
          lihat semua di peta
        </Link>
        .
      </p>

      {!partners.length ? (
        <div className="text-center text-ink-soft py-6">
          Belum ada mitra terdaftar untuk jalur ini. Coba lagi nanti.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {partners.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectPartner(p)}
              className={`flex justify-between items-center border rounded-sm2 px-4 py-3.5 text-left transition-colors ${
                selectedPartner?.id === p.id ? "border-moss bg-signal/10" : "border-line hover:border-moss"
              }`}
            >
              <div>
                <div className="font-semibold text-sm">{p.namaLokasi}</div>
                <div className="text-xs text-ink-soft">{p.partner?.nama}</div>
              </div>
              <span className="btn btn-ghost btn-sm">Pilih</span>
            </button>
          ))}
        </div>
      )}

      <Button block className="mt-5" disabled={!selectedPartner} loading={txSubmitting} onClick={onSubmitTransaction}>
        {txSubmitting ? "Mengajukan…" : "Ajukan Transaksi"}
      </Button>
      <Link to="/dashboard" className="btn btn-ghost btn-block mt-2.5">
        Lewati, lihat dashboard
      </Link>
    </div>
  );
}
