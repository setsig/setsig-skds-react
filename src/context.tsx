"use client";

import * as React from "react";
import type { SetsigConfig } from "./types.js";

interface SetsigContextValue {
  config: SetsigConfig;
  apiUrl: string;
}

const SetsigContext = React.createContext<SetsigContextValue | null>(null);

export interface SetsigProviderProps {
  apiKey: string;
  apiUrl?: string;
  tenantId?: string;
  children: React.ReactNode;
}

/**
 * SetsigProvider supplies client API keys and endpoint configuration to setsig hooks.
 * Next.js App Router and React 18/19 compatible.
 */
export function SetsigProvider({
  apiKey,
  apiUrl = "https://api.setsig.com",
  tenantId,
  children,
}: SetsigProviderProps) {
  const value = React.useMemo<SetsigContextValue>(
    () => ({
      config: { apiKey, apiUrl, tenantId },
      apiUrl: apiUrl.replace(/\/$/, ""),
    }),
    [apiKey, apiUrl, tenantId]
  );

  return <SetsigContext.Provider value={value}>{children}</SetsigContext.Provider>;
}

export function useSetsigContext(): SetsigContextValue {
  const context = React.useContext(SetsigContext);
  if (!context) {
    throw new Error("useSetsigContext must be used within a <SetsigProvider />");
  }
  return context;
}

