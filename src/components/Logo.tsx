export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="kwaraLGTracker logo"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="klgt-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#12a35a" />
          <stop offset="1" stopColor="#065f33" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#klgt-bg)" />
      {/* allocation bars */}
      <rect x="12" y="38" width="9" height="14" rx="2" fill="#fff" opacity="0.85" />
      <rect x="25" y="30" width="9" height="22" rx="2" fill="#fff" opacity="0.92" />
      <rect x="38" y="22" width="9" height="30" rx="2" fill="#fff" />
      {/* tracking trend line + pin dot */}
      <path
        d="M11 31 L25 21 L36 25 L52 11"
        fill="none"
        stroke="#ffd54a"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="52" cy="11" r="5" fill="#ffd54a" />
      <circle cx="52" cy="11" r="2" fill="#065f33" />
    </svg>
  );
}

