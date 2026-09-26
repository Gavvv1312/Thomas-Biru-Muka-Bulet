import { useState } from "react";
import { Link, useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "../components/layout/PageTransition.jsx";
import BrandMark from "../components/BrandMark.jsx";
import Button from "../components/ui/Button.jsx";
import { useAuth, homeForRole } from "../lib/AuthContext.jsx";

export default function Login() {
  const [searchParams] = useSearchParams();
  const [isPartnerTab, setIsPartnerTab] = useState(searchParams.get("role") === "partner");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  if (isLoggedIn) {
    const next = searchParams.get("next");
    return <Navigate to={next ? `${next}${next.includes("?") ? "&" : "?"}resume=1` : homeForRole(user.role)} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      const next = searchParams.get("next");
      navigate(next ? `${next}${next.includes("?") ? "&" : "?"}resume=1` : homeForRole(loggedInUser.role));
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen grid md:grid-cols-2">
        <div className="p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-br from-paper to-paper-dim">
          <Link to="/" className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-soft">
            ← Kembali
          </Link>
          <div className="max-w-[40ch] my-auto py-10">
            <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-lg text-moss-deep mb-6">
              <BrandMark size={32} />
              CycleWaste
            </Link>
            <h1 className="text-[34px]">Masuk untuk melanjutkan rantai sirkularmu.</h1>
            <p className="text-ink-soft mt-3.5">
              Lacak estimasi, transaksi, dan Green Points-mu — atau kelola pengajuan masuk jika kamu mitra
              teknisi/recycler.
            </p>
          </div>
          <p className="text-ink-soft text-xs">© 2026 CycleWaste</p>
        </div>

        <div className="p-8 sm:p-12 flex items-center justify-center bg-surface">
          <div className="w-full max-w-[380px]">
            <div className="flex gap-1 mb-7 bg-paper border border-line rounded-full p-1">
              {[
                { key: false, label: "Masyarakat" },
                { key: true, label: "Mitra (Teknisi/Recycler)" },
              ].map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setIsPartnerTab(tab.key)}
                  className={`flex-1 py-2.5 rounded-full font-display text-[13px] font-semibold transition-colors ${
                    isPartnerTab === tab.key ? "bg-moss text-white" : "text-ink-soft"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <h2 className="text-2xl mb-1">Login</h2>
            <AnimatePresence mode="wait">
              <motion.p
                key={isPartnerTab ? "partner" : "owner"}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="text-ink-soft text-sm mb-6"
              >
                {isPartnerTab ? "Masuk ke dashboard mitra teknisi atau recycler." : "Masuk ke akun pemilik perangkatmu."}
              </motion.p>
            </AnimatePresence>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field mb-5">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="nama@email.com"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="field mb-5">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" block loading={loading}>
                {loading ? "Memproses…" : "Login"}
              </Button>
            </form>

            <p className="text-ink-soft text-sm mt-5">
              Belum punya akun?{" "}
              <Link to="/register" className="text-moss-deep font-semibold">
                Daftar sebagai pemilik perangkat
              </Link>
            </p>

            <div className="text-xs text-ink-soft bg-paper border border-dashed border-line rounded-sm2 px-3 py-2.5 mt-5">
              {isPartnerTab ? (
                <>
                  Demo teknisi: <code className="font-semibold text-moss-deep">teknisi@cyclewaste.id</code> · Demo
                  recycler: <code className="font-semibold text-moss-deep">recycler@cyclewaste.id</code> /{" "}
                  <code className="font-semibold text-moss-deep">password123</code>
                </>
              ) : (
                <>
                  Demo: <code className="font-semibold text-moss-deep">owner@cyclewaste.id</code> /{" "}
                  <code className="font-semibold text-moss-deep">password123</code>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
