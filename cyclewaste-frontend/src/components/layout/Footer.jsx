import { Link } from "react-router-dom";
import BrandMark from "../BrandMark.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="max-w-[1160px] mx-auto px-6 flex flex-wrap justify-between items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-base text-moss-deep">
          <BrandMark size={24} />
          CycleWaste
        </Link>
        <div className="flex gap-5 text-[13px] text-ink-soft">
          <Link to="/kalkulator" className="hover:text-moss-deep transition-colors">
            Cek Estimasi
          </Link>
          <Link to="/peta" className="hover:text-moss-deep transition-colors">
            Peta Mitra
          </Link>
          <Link to="/login?role=partner" className="hover:text-moss-deep transition-colors">
            Portal Mitra
          </Link>
        </div>
        <p className="text-ink-soft text-[13px]">© 2026 CycleWaste. Platform reverse logistics e-waste.</p>
      </div>
    </footer>
  );
}
