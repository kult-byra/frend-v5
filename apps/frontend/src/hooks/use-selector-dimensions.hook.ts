import { useCallback, useState } from "react";
import { useEventListener } from "@/hooks/use-event-listener.hook";

export const useSelectorDimensions = (selector: string) => {
  const [dimensions, setDimensions] = useState<DOMRect | null>(null);

  const refresh = useCallback(() => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      const domRect = element.getBoundingClientRect();
      setDimensions(domRect);
    }
  }, [selector]);

  // Listen for resize events
  useEventListener("resize", refresh);

  return { dimensions, refresh };
};
