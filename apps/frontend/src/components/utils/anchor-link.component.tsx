"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn.util";
import type { LinkResolverProps } from "./link-resolver.component";

type AnchorLinkProps = {
  _key?: string;
  id: string;
  title?: string | null;
};

export const AnchorLink = ({
  id,
  className,
  children,
  onClick,
  ref,
}: AnchorLinkProps & LinkResolverProps) => {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setTarget(document.getElementById(id));
  }, [id]);

  const handleAnchorLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      window.location.hash = id;
    }, 1000);
  };

  if (!id) return <>{children}</>;

  return (
    <Link
      ref={ref as React.Ref<HTMLAnchorElement>}
      onClick={(e) => {
        handleAnchorLinkClick(e);
        onClick?.(e);
      }}
      href={`#${id}`}
      className={cn("group", className)}
    >
      {children}
    </Link>
  );
};
