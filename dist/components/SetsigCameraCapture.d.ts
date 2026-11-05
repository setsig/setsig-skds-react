import * as React from "react";
import type { VisualProofData } from "../types.js";
export interface SetsigCameraCaptureProps {
    venueId: string;
    onCaptured: (proof: VisualProofData) => void;
    onError?: (error: string) => void;
    className?: string;
}
/**
 * SetsigCameraCapture captures a photo via WebRTC camera and produces a Claim 10 SHA-256 visual proof.
 */
export declare function SetsigCameraCapture({ venueId, onCaptured, onError, className, }: SetsigCameraCaptureProps): React.JSX.Element;
//# sourceMappingURL=SetsigCameraCapture.d.ts.map