import { notFound } from "next/navigation";

import { cn } from "@/utils/cn.util";
import { dmMono, suisseIntl } from "../layout";

export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <html lang="no" className={cn(suisseIntl.variable, dmMono.variable)}>
      <body>
        <div className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-amber-400 px-4 py-2 font-sans text-sm font-medium text-amber-950">
          <span>Dev Mode</span>
          <span className="text-amber-800">&mdash;</span>
          <span className="text-amber-800">This page is only available in development</span>
        </div>
        {children}
      </body>
    </html>
  );
}
