import Image from "next/image";

export type LogoColor = "dark" | "orange" | "light";
export type LogoVariant = "standard" | "angled1" | "angled2";

interface LogoProps {
  color?: LogoColor;
  variant?: LogoVariant;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

const LOGO_PATHS: Record<LogoColor, Record<LogoVariant, string>> = {
  dark: {
    standard: "/logos/logo-dark.svg",
    angled1: "/logos/logo-dark-angled1.svg",
    angled2: "/logos/logo-dark-angled2.svg",
  },
  orange: {
    standard: "/logos/logo-orange.svg",
    angled1: "/logos/logo-orange-angled1.svg",
    angled2: "/logos/logo-orange-angled2.svg",
  },
  light: {
    standard: "/logos/logo-light.svg",
    angled1: "/logos/logo-light-angled1.svg",
    angled2: "/logos/logo-light-angled2.svg",
  },
};

export function Logo({
  color = "dark",
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
