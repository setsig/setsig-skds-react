import * as React from "react";
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
export declare function SetsigQRCode({ venueId, size, refreshIntervalSeconds, bindToClientToken, className, onRefresh, }: SetsigQRCodeProps): React.JSX.Element;
//# sourceMappingURL=SetsigQRCode.d.ts.map