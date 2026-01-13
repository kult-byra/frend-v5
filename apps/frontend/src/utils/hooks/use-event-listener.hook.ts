import { useEffect } from "react";

type EventType = "resize" | "scroll";

export const useEventListener = (event: EventType, listener: () => void, useCapture?: boolean) => {
  useEffect(() => {
    if (listener) {
      listener();
      window.addEventListener(event, listener, useCapture);

      return () => window.removeEventListener(event, listener, useCapture);
    }

    return () => {};
  }, [event, listener, useCapture]);
};
