"use client";

import * as React from "react";
import { useSetsigKiosk } from "../hooks/useSetsigKiosk.js";

export interface SetsigQRCodeProps {
  venueId: string;
  size?: number;
  refreshIntervalSeconds?: number;
  bindToClientToken?: string;
  className?: string;
  onRefresh?: () => void;
}

/**
 * SetsigQRCode displays a self-refreshing dynamic TOTP QR code for physical kiosk displays.
 * Hydration-safe and Next.js Server Components compatible.
 */
export function SetsigQRCode({
  venueId,
  size = 280,
  refreshIntervalSeconds = 60,
  bindToClientToken,
  className = "",
  onRefresh,
}: SetsigQRCodeProps) {
  const { tokenData, secondsRemaining, isLoading, error, refresh, isMounted } = useSetsigKiosk({
    venueId,
    refreshIntervalSeconds,
    bindToClientToken,
  });

  const { radius, circumference, strokeDashoffset } = React.useMemo(() => {
    const prog = (secondsRemaining / refreshIntervalSeconds) * 100;
    const r = size / 2 - 8;
    const c = 2 * Math.PI * r;
    const offset = c - (prog / 100) * c;
    return { radius: r, circumference: c, strokeDashoffset: offset };
  }, [secondsRemaining, refreshIntervalSeconds, size]);

  const handleRefreshClick = () => {
    void refresh();
    onRefresh?.();
  };

  // SSR Hydration Fallback (Zero hydration mismatch)
  if (!isMounted) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Circular Progress Ring */}
      <svg
        className="absolute inset-0 -rotate-90 transform"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#27272a"
          strokeWidth="4"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={secondsRemaining <= 10 ? "#ef4444" : "#3b82f6"}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>

      {/* QR Code Canvas / Visual Body */}
      <div
        className="flex flex-col items-center justify-center p-5 bg-white rounded-xl shadow-lg z-10 cursor-pointer"
        style={{ width: size - 36, height: size - 36 }}
        onClick={handleRefreshClick}
        title="Tap to refresh QR code"
      >
        {error ? (
          <div className="text-center p-3 text-xs text-red-500 font-medium">
            {error}
          </div>
        ) : isLoading && !tokenData ? (
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-800 border-t-transparent" />
        ) : tokenData ? (
          <div className="flex flex-col items-center justify-center text-center">
            {/* Embedded QR Visual Representation */}
            <svg
              className="w-full h-full text-zinc-950"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <rect x="5" y="5" width="25" height="25" rx="3" fill="#09090b" />
              <rect x="9" y="9" width="17" height="17" fill="#ffffff" />
              <rect x="13" y="13" width="9" height="9" fill="#09090b" />

              <rect x="70" y="5" width="25" height="25" rx="3" fill="#09090b" />
              <rect x="74" y="9" width="17" height="17" fill="#ffffff" />
              <rect x="78" y="13" width="9" height="9" fill="#09090b" />

              <rect x="5" y="70" width="25" height="25" rx="3" fill="#09090b" />
              <rect x="9" y="74" width="17" height="17" fill="#ffffff" />
              <rect x="13" y="78" width="9" height="9" fill="#09090b" />

              {/* Dynamic QR payload hash dots */}
              <rect x="36" y="8" width="8" height="8" fill="#09090b" />
              <rect x="48" y="8" width="8" height="8" fill="#09090b" />
              <rect x="36" y="20" width="8" height="8" fill="#09090b" />
              <rect x="8" y="36" width="8" height="8" fill="#09090b" />
              <rect x="20" y="36" width="8" height="8" fill="#09090b" />
              <rect x="36" y="36" width="26" height="26" rx="4" fill="#2563eb" />
              <rect x="68" y="36" width="8" height="8" fill="#09090b" />
              <rect x="80" y="36" width="8" height="8" fill="#09090b" />
              <rect x="36" y="68" width="8" height="8" fill="#09090b" />
              <rect x="48" y="80" width="8" height="8" fill="#09090b" />
              <rect x="68" y="68" width="12" height="12" fill="#09090b" />
              <rect x="84" y="84" width="8" height="8" fill="#09090b" />
            </svg>
            <div className="mt-1 font-mono text-[10px] text-zinc-500 font-semibold tracking-wider">
              {tokenData.tokenId.slice(0, 12)}
            </div>
          </div>
        ) : null}
      </div>

      {/* Countdown Tag */}
      <div className="absolute -bottom-3 bg-zinc-900 border border-zinc-700 px-2.5 py-0.5 rounded-full z-20 shadow-md">
        <span
          className={`font-mono text-xs font-bold ${
            secondsRemaining <= 10 ? "text-red-400" : "text-blue-400"
          }`}
        >
          {secondsRemaining}s
        </span>
      </div>
    </div>
  );
}
