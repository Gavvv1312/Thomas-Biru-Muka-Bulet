const STATUS_CLASS = {
  diajukan: "badge-status-diajukan",
  ditawar: "badge-status-ditawar",
  diverifikasi: "badge-status-diverifikasi",
  selesai: "badge-status-selesai",
  dibatalkan: "badge-status-dibatalkan",
};

export function StatusBadge({ status }) {
  return <span className={`badge ${STATUS_CLASS[status] || ""}`}>{status}</span>;
}

export function ChannelBadge({ jalur }) {
  const isBuyback = jalur === "buyback";
  return (
    <span className={`badge ${isBuyback ? "badge-buyback" : "badge-recycle"}`}>
      <span className="badge-dot" />
      {jalur}
    </span>
  );
}

export default function Badge({ children, className = "" }) {
  return <span className={`badge ${className}`}>{children}</span>;
}
