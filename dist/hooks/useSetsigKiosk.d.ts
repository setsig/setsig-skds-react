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
export declare function useSetsigKiosk({ venueId, refreshIntervalSeconds, bindToClientToken, autoRefresh, }: UseSetsigKioskOptions): UseSetsigKioskReturn;
//# sourceMappingURL=useSetsigKiosk.d.ts.map