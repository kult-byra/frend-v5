import type { PropsWithChildren } from "react";

import { cn } from "@/utils/cn.util";
import { hyphenate } from "@/utils/hyphenate.util";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = HeadingLevel;

type HeadingProps = PropsWithChildren<{
  level: HeadingLevel;
  size?: HeadingSize;
  className?: string;
  id?: string;
  hyphens?: boolean;
  balance?: boolean;
}>;

export const Heading = (props: HeadingProps) => {
  const { level = 2, size: originalSize, className, id, children, balance = true } = props;

  if (!children) return null;

  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  const size = originalSize ?? level;

  const styles = cn(getSize(size), "font-semibold", className);

  return (
    <Tag id={id} className={styles}>
      {size === 1 && balance ? (
        <div className="text-pretty">
          <HeadingInner {...props} size={size}>
            {children}
          </HeadingInner>
        </div>
      ) : (
        <HeadingInner {...props} size={size}>
          {children}
        </HeadingInner>
      )}
    </Tag>
  );
};

const HeadingInner = (props: HeadingProps) => {
  const { children, size, hyphens } = props;

  let title = children;

  if (
    (typeof children === "string" && size && size < 2) ||
    (typeof children === "string" && hyphens)
  ) {
    title = hyphenate(children, 10);
  }

  return <>{title}</>;
};

const getSize = (size: HeadingSize) => {
  switch (size) {
    case 1:
      return "text-2xl";
    case 2:
      return "text-xl";
    case 3:
      return "text-lg";
    case 4:
      return "text-base";
    case 5:
      return "text-sm";
    default:
      return "text-xs uppercase tracking-wide";
  }
};

type H = Omit<HeadingProps, "level">;

export const H1 = ({ size = 1, children, ...props }: H) => (
  <Heading level={1} size={size} {...props}>
    {children}
  </Heading>
);

export const H2 = ({ size = 2, children, ...props }: H) => (
  <Heading level={2} size={size} {...props}>
    {children}
  </Heading>
);

export const H3 = ({ size = 3, children, ...props }: H) => (
  <Heading level={3} size={size} {...props}>
    {children}
  </Heading>
);

export const H4 = ({ size = 4, children, ...props }: H) => (
  <Heading level={4} size={size} {...props}>
    {children}
  </Heading>
);

export const H5 = ({ size = 5, children, ...props }: H) => (
  <Heading level={5} size={size} {...props}>
    {children}
  </Heading>
);

export const H6 = ({ size = 6, children, ...props }: H) => (
  <Heading level={6} size={size} {...props}>
    {children}
  </Heading>
);
