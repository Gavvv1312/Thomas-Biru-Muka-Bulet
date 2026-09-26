import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiLogOut, FiGrid } from "react-icons/fi";
import BrandMark from "../BrandMark.jsx";
import ThemeToggle from "../ui/ThemeToggle.jsx";
import { useAuth, homeForRole } from "../../lib/AuthContext.jsx";

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-40 backdrop-blur-md bg-paper/90 transition-shadow ${
        scrolled ? "border-b border-line" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-[1160px] mx-auto px-6 h-[76px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-lg text-moss-deep">
          <BrandMark size={30} />
          CycleWaste
        </Link>

        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-ink-soft">
          <a href="/#cara-kerja" className="hover:text-moss-deep transition-colors">
            Cara Kerja
          </a>
          <a href="/#jalur" className="hover:text-moss-deep transition-colors">
            Jalur Kanal
          </a>
          <Link to="/peta" className="hover:text-moss-deep transition-colors">
            Peta Mitra
          </Link>
          <a href="/#mitra" className="hover:text-moss-deep transition-colors">
            Untuk Mitra
          </a>
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              <Link
                to={homeForRole(user?.role)}
                className="btn btn-ghost btn-sm hidden sm:inline-flex items-center gap-1.5"
              >
                <FiGrid /> Dashboard
              </Link>
              <button
                onClick={() => logout().then(() => navigate("/"))}
                className="btn btn-ghost btn-sm inline-flex items-center gap-1.5"
              >
                <FiLogOut /> Keluar
              </button>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <motion.button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setDropdownOpen((v) => !v)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Login
                <motion.span animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
                  <FiChevronDown />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 mt-2 w-64 bg-surface border border-line rounded-md2 shadow-card p-2 origin-top-right"
                  >
                    <p className="text-xs font-semibold text-ink-soft px-3 py-2">Masuk sebagai</p>
                    <Link
                      to="/login"
                      onClick={() => setDropdownOpen(false)}
                      className="flex flex-col px-3 py-2.5 rounded-sm2 hover:bg-paper-dim transition-colors"
                    >
                      <span className="font-semibold text-sm">Masyarakat</span>
                      <span className="text-xs text-ink-soft">Cek nilai, ajukan transaksi, kumpulkan poin</span>
                    </Link>
                    <Link
                      to="/login?role=partner"
                      onClick={() => setDropdownOpen(false)}
                      className="flex flex-col px-3 py-2.5 rounded-sm2 hover:bg-paper-dim transition-colors"
                    >
                      <span className="font-semibold text-sm">Mitra (Teknisi/Recycler)</span>
                      <span className="text-xs text-ink-soft">Kelola transaksi yang masuk</span>
                    </Link>
                    <div className="border-t border-line my-1.5" />
                    <Link
                      to="/register"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-3 py-2.5 rounded-sm2 hover:bg-paper-dim transition-colors text-sm font-semibold text-moss-deep"
                    >
                      Belum punya akun? Daftar →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
