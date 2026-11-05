"use client";

import * as React from "react";
import { useSetsigContext } from "../context.js";
import type { KioskTokenData } from "../types.js";

export interface UseSetsigKioskOptions {
  venueId: string;
  refreshIntervalSeconds?: number;
  bindToClientToken?: string;
  autoRefresh?: boolean;
}

export interface UseSetsigKioskReturn {
  tokenData: KioskTokenData | null;
  secondsRemaining: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  isMounted: boolean;
}

/**
 * useSetsigKiosk manages dynamic TOTP QR code lifecycles on kiosk displays and iPads.
 * Features hydration-safe timers and automatic seed renewal.
 */
export function useSetsigKiosk({
  venueId,
  refreshIntervalSeconds = 60,
  bindToClientToken,
  autoRefresh = true,
}: UseSetsigKioskOptions): UseSetsigKioskReturn {
  const { apiUrl, config } = useSetsigContext();
  const [tokenData, setTokenData] = React.useState<KioskTokenData | null>(null);
  const [secondsRemaining, setSecondsRemaining] = React.useState<number>(refreshIntervalSeconds);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isMounted, setIsMounted] = React.useState<boolean>(false);

  // SSR hydration safety guard
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchToken = React.useCallback(async () => {
    if (!venueId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/v1/tokens/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          venue_id: venueId,
          ttl_seconds: refreshIntervalSeconds,
          bind_to_client_token: bindToClientToken,
        }),
      });

      if (!res.ok) {
        throw new Error(`Kiosk token request failed: ${res.statusText}`);
      }

      const envelope = await res.json();
      const data = envelope.data || envelope;

      const payload: KioskTokenData = {
        tokenId: data.token_id || data.tokenId,
        qrPayload: data.qr_payload || data.qrPayload,
        expiresAt: data.expires_at || data.expiresAt,
        ttlRemaining: data.ttl_remaining || refreshIntervalSeconds,
      };

      setTokenData(payload);
      setSecondsRemaining(payload.ttlRemaining);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load kiosk token";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, config.apiKey, venueId, refreshIntervalSeconds, bindToClientToken]);

  // Initial fetch on mount
  React.useEffect(() => {
    if (isMounted) {
      void fetchToken();
    }
  }, [isMounted, fetchToken]);

  // Tick countdown timer
  React.useEffect(() => {
    if (!isMounted || !autoRefresh) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev: number) => {
        if (prev <= 1) {
          void fetchToken();
          return refreshIntervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isMounted, autoRefresh, fetchToken, refreshIntervalSeconds]);

  return {
    tokenData,
    secondsRemaining,
    isLoading,
    error,
    refresh: fetchToken,
    isMounted,
  };
}
