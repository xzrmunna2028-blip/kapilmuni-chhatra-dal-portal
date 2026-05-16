interface ChhatraLogoProps {
  size?: number;
  className?: string;
}

export default function ChhatraLogo({
  size = 60,
  className = "",
}: ChhatraLogoProps) {
  return (
    <svg
      viewBox="0 0 200 230"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size ? Math.round(size * 1.15) : undefined}
      className={className}
      aria-label="২নং কপিলমুনি ইউনিয়ন ছাত্রদল লোগো"
      role="img"
    >
      <defs>
        <path id="outerTopArc" d="M 15,100 A 85,85 0 0,1 185,100" />
        <path id="outerBottomArc" d="M 25,130 A 80,80 0 0,0 175,130" />
      </defs>
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="white"
        stroke="#006400"
        strokeWidth="4"
      />
      <circle
        cx="100"
        cy="100"
        r="82"
        fill="none"
        stroke="#cc0000"
        strokeWidth="1.5"
      />
      <circle
        cx="100"
        cy="100"
        r="78"
        fill="none"
        stroke="#006400"
        strokeWidth="0.5"
      />
      <text
        fontSize="10"
        fill="#006400"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        <textPath href="#outerTopArc" startOffset="50%" textAnchor="middle">
          বাংলাদেশ জাতীয়তাবাদী ছাত্রদল
        </textPath>
      </text>
      <text
        fontSize="9.5"
        fill="#cc0000"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        <textPath href="#outerBottomArc" startOffset="50%" textAnchor="middle">
          ২নং কপিলমুনি ইউনিয়ন
        </textPath>
      </text>
      <text
        x="100"
        y="88"
        textAnchor="middle"
        fontSize="22"
        fill="#cc0000"
        fontWeight="bold"
        fontFamily="serif"
      >
        ছাত্রদল
      </text>
      <text
        x="100"
        y="108"
        textAnchor="middle"
        fontSize="9"
        fill="#006400"
        fontFamily="Arial, sans-serif"
      >
        বাংলাদেশ জাতীয়তাবাদী
      </text>
      <polygon
        points="100,55 103,65 113,65 105,71 108,81 100,75 92,81 95,71 87,65 97,65"
        fill="#006400"
      />
      <text
        x="100"
        y="215"
        textAnchor="middle"
        fontSize="13"
        fill="#006400"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        বাংলাদেশ জিন্দাবাদ
      </text>
    </svg>
  );
}
