import { stegaClean } from "@sanity/client/stega";
import type { SVGProps } from "react";
import type { IconName } from "@/icon-name";
import { cn } from "@/utils/cn.util";

const href = "/icons/sprite.svg";

export type { IconName };

const sizeClassName = {
  font: "w-[1em] h-[1em]", // Inherits font size
  xs: "w-3 h-3", // 12px
  sm: "w-4 h-4", // 16px
  md: "w-5 h-5", // 20px
  lg: "w-6 h-6", // 24px
  xl: "w-7 h-7", // 28px
} as const;

const childrenSizeClassName = {
  font: "gap-1.5",
  xs: "gap-1.5",
  sm: "gap-1.5",
  md: "gap-2",
  lg: "gap-2",
  xl: "gap-3",
} satisfies Record<Size, string>;

type Size = keyof typeof sizeClassName;

type IconProps = Omit<SVGProps<SVGSVGElement>, "aria-label" | "aria-hidden" | "role"> & {
  name: IconName;
  size?: Size;
  /**
   * Accessibility label for the icon. If not provided, the icon will be hidden from screen readers.
   * For decorative icons, leave this undefined.
   * For meaningful icons (where screenreaders reading the icon out loud will improve the user experience), provide a Norwegian description.
   * @example "Søk" for a search icon
   * @example undefined for a decorative arrow
   */
  label?: string;
};

/**
 * Icon component that handles accessibility automatically:
 * - If used with children (text), the icon is hidden from screen readers
 * - If used without a label, the icon is hidden from screen readers (decorative)
 * - If used with a label, the icon is announced with the label (meaningful)
 *
 * @example
 * // Decorative icon (hidden from screen readers)
 * <Icon name="sm-arrow-right" />
 *
 * // Meaningful icon with Norwegian label
 * <Icon name="search" label="Søk" />
 *
 * // Icon with text (icon hidden, text read)
 * <Icon name="download">Last ned PDF</Icon>
 */
export function Icon({ name, size = "font", className, children, label, ...props }: IconProps) {
  if (children) {
    return (
      <span className={cn("inline-flex items-center", childrenSizeClassName[size])}>
        <svg
          aria-hidden={!label}
          aria-label={label}
          role="presentation"
          className={cn(sizeClassName[size], "inline self-center", className)}
          {...props}
        >
          <use href={`${href}#${stegaClean(name)}`} />
        </svg>
        {children}
      </span>
    );
  }

  return (
    <svg
      aria-hidden={!label}
      aria-label={label}
      role={label ? "img" : "presentation"}
      className={cn(sizeClassName[size], "inline self-center", className)}
      {...props}
    >
      <use href={`${href}#${stegaClean(name)}`} />
    </svg>
  );
}
