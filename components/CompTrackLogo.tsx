interface CompTrackLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function CompTrackLogo({ size = "md", showText = true }: CompTrackLogoProps) {
  const dim = size === "sm" ? 32 : size === "lg" ? 52 : 40;

  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <rect width="40" height="40" rx="8" fill="#0A1628" />
        <rect width="40" height="3" rx="1.5" fill="#00BCD4" />
        <path
          d="M14 20 A7 7 0 1 0 14 21"
          stroke="#D4AF37"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="24" y="27" width="3" height="6" rx="1" fill="#D4AF37" opacity="0.5" />
        <rect x="28" y="23" width="3" height="10" rx="1" fill="#D4AF37" opacity="0.75" />
        <rect x="32" y="19" width="3" height="14" rx="1" fill="#D4AF37" />
        <polyline
          points="25,26 29,22 35,18"
          stroke="#00BCD4"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {showText && (
        <div>
          <p
            className="font-bold leading-none"
            style={{ fontSize: size === "sm" ? 13 : size === "lg" ? 18 : 15, letterSpacing: "-0.3px" }}
          >
            <span style={{ color: "#FFFFFF" }}>Comp</span>
            <span style={{ color: "#00BCD4" }}>Track</span>
          </p>
          <p
            className="leading-none mt-0.5"
            style={{ fontSize: size === "sm" ? 9 : size === "lg" ? 12 : 10, color: "#D4AF37", letterSpacing: "1px", opacity: 0.8 }}
          >
            GESTION · PME AFRICAINES
          </p>
        </div>
      )}
    </div>
  );
}
