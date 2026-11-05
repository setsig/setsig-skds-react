import * as React from "react";
import type { SetsigConfig } from "./types.js";
interface SetsigContextValue {
    config: SetsigConfig;
    apiUrl: string;
}
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
export declare function SetsigProvider({ apiKey, apiUrl, tenantId, children, }: SetsigProviderProps): React.JSX.Element;
export declare function useSetsigContext(): SetsigContextValue;
export {};
//# sourceMappingURL=context.d.ts.map