export default function BrandMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="9" fill="#1F3D2B" />
      <path d="M9 21c0-6.5 4.2-10.5 10.5-10.5" stroke="#B7E24D" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M9 21c3.2 0 6.3-1.1 8.4-3.3" stroke="#B7E24D" strokeWidth="2.3" strokeLinecap="round" />
      <circle cx="19.5" cy="10.5" r="2.1" fill="#B7E24D" />
      <circle cx="9" cy="21" r="2.1" fill="#B7E24D" />
    </svg>
  );
}
