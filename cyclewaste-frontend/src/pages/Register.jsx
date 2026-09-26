import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import PageTransition from "../components/layout/PageTransition.jsx";
import BrandMark from "../components/BrandMark.jsx";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../lib/AuthContext.jsx";

export default function Register() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (isLoggedIn) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({ nama: nama.trim(), email: email.trim(), password });
      navigate("/dashboard");
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
            <h1 className="text-[34px]">Buat akun, mulai menyelamatkan komponen.</h1>
            <p className="text-ink-soft mt-3.5">
              Daftar sebagai pemilik perangkat untuk cek estimasi nilai, mengajukan transaksi, dan mengumpulkan
              Green Points.
            </p>
          </div>
          <p className="text-ink-soft text-xs">© 2026 CycleWaste</p>
        </div>

        <div className="p-8 sm:p-12 flex items-center justify-center bg-surface">
          <div className="w-full max-w-[380px]">
            <h2 className="text-2xl mb-1">Daftar Akun</h2>
            <p className="text-ink-soft text-sm mb-6">Untuk pemilik perangkat elektronik.</p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field mb-4">
                <label htmlFor="nama">Nama Lengkap</label>
                <input
                  id="nama"
                  type="text"
                  required
                  minLength={2}
                  placeholder="Nama kamu"
                  className="input"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>
              <div className="field mb-4">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
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
                  minLength={6}
                  placeholder="Minimal 6 karakter"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" block loading={loading}>
                {loading ? "Memproses…" : "Daftar"}
              </Button>
            </form>

            <p className="text-ink-soft text-sm mt-5">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-moss-deep font-semibold">
                Login di sini
              </Link>
            </p>

            <div className="text-xs text-ink-soft bg-paper border border-dashed border-line rounded-sm2 px-3 py-2.5 mt-5">
              Teknisi & recycler: akun mitra disiapkan oleh tim CycleWaste. Hubungi admin untuk aktivasi, lalu{" "}
              <Link to="/login?role=partner" className="text-moss-deep font-semibold">
                login di sini
              </Link>
              .
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
