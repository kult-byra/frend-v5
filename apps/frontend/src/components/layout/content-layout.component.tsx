import type { ReactNode } from "react";
import { cn } from "@/utils/cn.util";

type ContentLayoutProps = {
  children: ReactNode;
  className?: string;
};

export const ContentLayout = ({ children, className }: ContentLayoutProps) => {
  return (
    <div className={cn("flex justify-end", className)}>
      <div className="w-full lg:w-1/2">{children}</div>
    </div>
  );
};
