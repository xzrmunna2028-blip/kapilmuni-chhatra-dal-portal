interface ChhatraLogoProps {
  size?: number;
  className?: string;
}

export default function ChhatraLogo({
  size = 60,
  className = "",
}: ChhatraLogoProps) {
  const cx = 100;
  const cy = 100;
  const outerR = 98;
  const midR = 90;

  const centerR = 36;
  const uid = `logo-${size}`;

  return (
    <div
      style={{
        width: size,
        height: size,
        overflow: "hidden",
        borderRadius: "50%",
        flexShrink: 0,
        display: "inline-block",
      }}
      className={className}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="২নং কপিলমুনি ইউনিয়ন ছাত্রদল লোগো"
        role="img"
        style={{ overflow: "hidden", borderRadius: "50%" }}
      >
        <defs>
          <clipPath id={`${uid}-top`}>
            <rect x="0" y="0" width="200" height="100" />
          </clipPath>
          <clipPath id={`${uid}-bottom`}>
            <rect x="0" y="100" width="200" height="100" />
          </clipPath>
          <clipPath id={`${uid}-circle`}>
            <circle cx={cx} cy={cy} r={midR} />
          </clipPath>
          {/* Arc paths for curved text */}
          <path
            id={`${uid}-arc-top`}
            d={`M ${cx - midR * 0.88} ${cy - midR * 0.05} A ${midR * 0.88} ${midR * 0.88} 0 0 1 ${cx + midR * 0.88} ${cy - midR * 0.05}`}
            fill="none"
          />
          <path
            id={`${uid}-arc-bot`}
            d={`M ${cx - midR * 0.88} ${cy + midR * 0.12} A ${midR * 0.88} ${midR * 0.88} 0 0 0 ${cx + midR * 0.88} ${cy + midR * 0.12}`}
            fill="none"
          />
        </defs>

        {/* Outer ring — red */}
        <circle cx={cx} cy={cy} r={outerR} fill="#DC143C" />

        {/* Inner ring — green */}
        <circle cx={cx} cy={cy} r={outerR - 6} fill="#006A4E" />

        {/* Top half — red background */}
        <circle
          cx={cx}
          cy={cy}
          r={midR}
          fill="#DC143C"
          clipPath={`url(#${uid}-top)`}
        />

        {/* Bottom half — dark green background */}
        <circle
          cx={cx}
          cy={cy}
          r={midR}
          fill="#006A4E"
          clipPath={`url(#${uid}-bottom)`}
        />

        {/* Horizontal divider */}
        <rect
          x={cx - midR}
          y={cy - 1}
          width={midR * 2}
          height={2}
          fill="white"
          opacity={0.8}
        />

        {/* Center white circle */}
        <circle cx={cx} cy={cy} r={centerR} fill="white" />

        {/* Bangladesh map silhouette (simplified) — green */}
        <g
          fill="#006A4E"
          transform={`translate(${cx - 14}, ${cy - 18}) scale(0.28)`}
        >
          <path d="M50 5 C45 8 42 15 40 22 C37 18 32 16 28 18 C24 20 22 26 24 30 C20 30 16 33 16 37 C16 42 20 46 25 46 C24 50 26 55 30 57 C35 59 40 57 43 53 C46 62 54 68 63 67 C72 66 77 57 75 48 C80 47 84 42 83 37 C82 32 77 28 72 29 C74 24 72 18 68 15 C63 12 57 14 55 19 C55 14 53 8 50 5Z" />
        </g>

        {/* 3 five-pointed stars on top (white) */}
        {[-1, 0, 1].map((off) => {
          const sx = cx + off * 22;
          const sy = cy - 58;
          const sr = 7;
          const pts = Array.from({ length: 5 }, (_, k) => {
            const a = (k * 72 - 90) * (Math.PI / 180);
            const b = (k * 72 + 36 - 90) * (Math.PI / 180);
            return `${sx + sr * Math.cos(a)},${sy + sr * Math.sin(a)} ${sx + sr * 0.4 * Math.cos(b)},${sy + sr * 0.4 * Math.sin(b)}`;
          }).join(" ");
          return <polygon key={off} points={pts} fill="white" />;
        })}

        {/* 'বাংলাদেশ' curved text on top half */}
        <text
          fontSize={12}
          fill="white"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
        >
          <textPath
            href={`#${uid}-arc-top`}
            startOffset="50%"
            textAnchor="middle"
          >
            বাংলাদেশ ছাত্রদল
          </textPath>
        </text>

        {/* Org name curved text on bottom half */}
        <text
          fontSize={8.5}
          fill="white"
          fontFamily="Arial, sans-serif"
          fontWeight="600"
        >
          <textPath
            href={`#${uid}-arc-bot`}
            startOffset="50%"
            textAnchor="middle"
          >
            ২নং কপিলমুনি ইউনিয়ন
          </textPath>
        </text>
      </svg>
    </div>
  );
}
