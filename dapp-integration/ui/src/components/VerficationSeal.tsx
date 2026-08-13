export function Seal({ verified }: { verified: boolean }) {
  const tint = verified ? "#188a3e" : "#a39c86";
  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 52 52"
      style={{ opacity: verified ? 1 : 0.5, transform: "rotate(-8deg)" }}
    >
      <defs>
        <path id="sealArc" d="M 8,26 A 18,18 0 1 1 44,26" fill="none" />
      </defs>
      <circle
        cx="26"
        cy="26"
        r="22"
        fill="none"
        stroke={tint}
        strokeWidth="1.2"
      />
      <circle
        cx="26"
        cy="26"
        r="18"
        fill="none"
        stroke={tint}
        strokeWidth="0.6"
      />
      <text fontSize="6.5" letterSpacing="1.5" fill={tint}>
        <textPath href="#sealArc" startOffset="2">
          {verified ? "HARDWARE VERIFIED" : "NOT CONNECTED"}
        </textPath>
      </text>
      {verified && (
        <path
          d="M18 27 L24 33 L35 20"
          stroke={tint}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
