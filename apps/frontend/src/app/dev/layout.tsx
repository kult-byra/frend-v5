import { cn } from "@/utils/cn.util";
import { dmMono, suisseIntl } from "../layout";

export default function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" className={cn(suisseIntl.variable, dmMono.variable)}>
      <body>{children}</body>
    </html>
  );
}
