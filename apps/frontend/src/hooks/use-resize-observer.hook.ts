import { type RefObject, useEffect } from "react";

/**
 * Hook that observes an element's size changes using ResizeObserver.
 * More efficient than window resize events as it only triggers when the element actually changes.
 */
export function useResizeObserver(
  ref: RefObject<HTMLElement | null>,
  callback: (entry: ResizeObserverEntry) => void,
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        callback(entry);
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, callback]);
}
