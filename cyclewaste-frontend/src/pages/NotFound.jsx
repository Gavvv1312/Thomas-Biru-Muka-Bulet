import PageTransition from "../components/layout/PageTransition.jsx";
import PublicNavbar from "../components/layout/PublicNavbar.jsx";
import LinkButton from "../components/ui/LinkButton.jsx";

export default function NotFound() {
  return (
    <PageTransition>
      <PublicNavbar />
      <div className="max-w-[1160px] mx-auto px-6 py-28 text-center">
        <p className="eyebrow font-display text-[13px] font-semibold text-moss">404</p>
        <h1 className="text-[32px] mt-2">Halaman tidak ditemukan.</h1>
        <p className="text-ink-soft mt-3 mb-8">Halaman yang kamu cari mungkin sudah dipindahkan atau tidak ada.</p>
        <LinkButton to="/">Kembali ke Beranda</LinkButton>
      </div>
    </PageTransition>
  );
}
