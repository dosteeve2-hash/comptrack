import Image from "next/image";

interface CompTrackLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  variant?: "paper" | "dark";
}

const dimensions = {
  sm: { width: 142, height: 42 },
  md: { width: 168, height: 50 },
  lg: { width: 196, height: 58 },
} as const;

export default function CompTrackLogo({
  size = "md",
  showText = true,
  variant = "dark",
}: CompTrackLogoProps) {
  const dimension = dimensions[size];
  const source = showText
    ? variant === "dark"
      ? "/brand/logo-sombre.svg"
      : "/brand/logo.svg"
    : "/brand/mark.svg";

  return (
    <Image
      src={source}
      alt="CompTrack"
      width={showText ? dimension.width : 40}
      height={showText ? dimension.height : 40}
      priority={size !== "sm"}
      unoptimized
    />
  );
}
