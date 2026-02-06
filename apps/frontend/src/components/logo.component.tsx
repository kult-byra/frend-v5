import Image from "next/image";

export type LogoColor = "white" | "navy" | "yellow";
export type LogoVariant = "standard" | "angled1" | "angled2";

interface LogoProps {
  color?: LogoColor;
  variant?: LogoVariant;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * Maps semantic color names to logo file names.
 * - white: Dark logo for white/light backgrounds
 * - navy: Light logo for navy/dark backgrounds
 * - yellow: Yellow/orange accent logo
 */
const LOGO_PATHS: Record<LogoColor, Record<LogoVariant, string>> = {
  white: {
    standard: "/logos/logo-dark.svg",
    angled1: "/logos/logo-dark-angled1.svg",
    angled2: "/logos/logo-dark-angled2.svg",
  },
  yellow: {
    standard: "/logos/logo-orange.svg",
    angled1: "/logos/logo-orange-angled1.svg",
    angled2: "/logos/logo-orange-angled2.svg",
  },
  navy: {
    standard: "/logos/logo-light.svg",
    angled1: "/logos/logo-light-angled1.svg",
    angled2: "/logos/logo-light-angled2.svg",
  },
};

export function Logo({
  color = "white",
  variant = "standard",
  className,
  width = 150,
  height = 50,
  priority = false,
}: LogoProps) {
  const src = LOGO_PATHS[color][variant];

  return (
    <Image
      src={src}
      alt="Frend logo"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
