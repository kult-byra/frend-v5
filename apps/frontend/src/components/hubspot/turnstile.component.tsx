"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { env } from "@/env";
import { cn } from "@/lib/utils";

export type TurnstileStatus = "idle" | "verifying" | "verified" | "error" | "expired";

export type TurnstileRef = {
  reset: () => void;
  getToken: () => string | null;
};

type TurnstileWidgetProps = {
  onStatusChange?: (status: TurnstileStatus) => void;
  onTokenChange?: (token: string | null) => void;
};

export const TurnstileWidget = forwardRef<TurnstileRef, TurnstileWidgetProps>(
  ({ onStatusChange, onTokenChange }, ref) => {
    const [status, setStatus] = useState<TurnstileStatus>("idle");
    const [token, setToken] = useState<string | null>(null);
    const turnstileRef = useRef<TurnstileInstance>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        turnstileRef.current?.reset();
        setToken(null);
        setStatus("idle");
        onTokenChange?.(null);
        onStatusChange?.("idle");
      },
      getToken: () => token,
    }));

    const updateStatus = (newStatus: TurnstileStatus) => {
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    };

    const statusText: Record<TurnstileStatus, string> = {
      idle: "",
      verifying: "Verifiserer...",
      verified: "Verifisert",
      error: "Verifisering feilet. Prøv igjen.",
      expired: "Verifisering utløpt. Laster på nytt...",
    };

    return (
      <div className="flex flex-col items-start gap-3xs">
        <Turnstile
          ref={turnstileRef}
          siteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          options={{
            size: "invisible",
            theme: "light",
          }}
          onWidgetLoad={() => {
            updateStatus("verifying");
          }}
          onSuccess={(newToken) => {
            setToken(newToken);
            onTokenChange?.(newToken);
            updateStatus("verified");
          }}
          onError={() => {
            setToken(null);
            onTokenChange?.(null);
            updateStatus("error");
          }}
          onExpire={() => {
            setToken(null);
            onTokenChange?.(null);
            updateStatus("expired");
            // Auto-reset on expiration
            turnstileRef.current?.reset();
          }}
        />
        <output
          aria-live="polite"
          className={cn(
            "text-body-small transition-opacity",
            status === "idle" && "sr-only",
            status === "verified" && "text-text-secondary",
            status === "error" && "text-stroke-error",
            (status === "verifying" || status === "expired") && "text-text-secondary",
          )}
        >
          {statusText[status]}
        </output>
      </div>
    );
  },
);

TurnstileWidget.displayName = "TurnstileWidget";
