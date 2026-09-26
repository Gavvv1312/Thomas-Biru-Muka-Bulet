import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import BrandMark from "../BrandMark.jsx";
import ThemeToggle from "../ui/ThemeToggle.jsx";
import { useAuth } from "../../lib/AuthContext.jsx";

export default function DashboardShell({ navItems, sectionLabel = "Menu", children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <aside
        className="w-full md:w-[248px] md:flex-shrink-0 bg-surface border-b md:border-b-0 md:border-r border-line
          px-4 py-3.5 md:px-5 md:py-7 flex flex-row md:flex-col items-center md:items-stretch
          overflow-x-auto md:overflow-visible md:sticky md:top-0 md:h-screen"
      >
        <div className="flex items-center justify-between w-full md:w-auto flex-shrink-0">
          <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-[17px] text-moss-deep">
            <BrandMark size={28} />
            CycleWaste
          </Link>
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>

        <div className="hidden md:flex items-center justify-between mt-8 mb-2.5 ml-2.5">
          <p className="text-[11px] font-bold tracking-wide text-ink-soft">{sectionLabel}</p>
          <ThemeToggle />
        </div>

        <nav className="flex flex-row md:flex-col gap-0.5 ml-5 md:ml-0">
          {navItems.map((item, i) => {
            const isActive = location.pathname === item.to;
            return (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.25 }}
              >
                <Link
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm2 text-sm font-medium whitespace-nowrap transition-colors
                    ${isActive ? "bg-moss text-white" : "text-ink-soft hover:bg-paper-dim hover:text-ink"}`}
                >
                  <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                  {item.label}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="hidden md:block flex-1" />

        <div className="ml-5 md:ml-0 md:mt-4 md:pt-4 md:border-t border-line flex-shrink-0">
          <button
            onClick={() => logout().then(() => navigate("/"))}
            className="flex items-center gap-3 px-3 py-2.5 rounded-sm2 text-sm font-medium text-ink-soft hover:bg-paper-dim hover:text-ink transition-colors whitespace-nowrap"
          >
            <FiLogOut className="w-[18px] h-[18px]" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 px-5 py-7 md:px-11 md:py-10 pb-16">{children}</main>
    </div>
  );
}
