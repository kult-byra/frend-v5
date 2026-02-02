"use server";

import { env } from "@/env";

type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
};

export type VerifyTurnstileResult = {
  success: boolean;
  error?: string;
};

/**
 * Verify a Cloudflare Turnstile token server-side.
 * Returns success: true if the token is valid, otherwise returns an error message.
 */
export async function verifyTurnstile(token: string): Promise<VerifyTurnstileResult> {
  if (!token) {
    return { success: false, error: "No verification token provided" };
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    });

    if (!response.ok) {
      return { success: false, error: "Verification service unavailable" };
    }

    const data = (await response.json()) as TurnstileVerifyResponse;

    if (!data.success) {
      const errorCodes = data["error-codes"] ?? [];
      console.error("Turnstile verification failed:", errorCodes);
      return { success: false, error: "Verification failed" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error verifying Turnstile token:", error);
    return { success: false, error: "Verification error" };
  }
}
