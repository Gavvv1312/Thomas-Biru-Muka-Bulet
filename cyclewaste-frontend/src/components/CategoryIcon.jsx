const PATHS = {
  smartphone: (
    <>
      <rect x="7" y="2" width="10" height="20" rx="2.2" />
      <line x1="10.5" y1="18.3" x2="13.5" y2="18.3" />
    </>
  ),
  laptop: (
    <>
      <rect x="4" y="4" width="16" height="10.5" rx="1.4" />
      <path d="M2.5 19.5h19L20 16.8H4L2.5 19.5z" />
    </>
  ),
  tablet: (
    <>
      <rect x="5" y="2.5" width="14" height="19" rx="2" />
      <line x1="10.5" y1="18.3" x2="13.5" y2="18.3" />
    </>
  ),
  desktop: (
    <>
      <rect x="4" y="3.5" width="16" height="11" rx="1.4" />
      <line x1="9" y1="19.5" x2="15" y2="19.5" />
      <line x1="12" y1="14.5" x2="12" y2="19.5" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.4" />
      <line x1="8" y1="20" x2="16" y2="20" />
      <line x1="12" y1="16" x2="12" y2="20" />
    </>
  ),
};

export default function CategoryIcon({ id, className = "w-9 h-9" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      strokeLinecap="round"
      className={className}
    >
      {PATHS[id] || PATHS.smartphone}
    </svg>
  );
}
