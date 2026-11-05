"use client";

// Context & Provider
export { SetsigProvider, useSetsigContext } from "./context.js";
export type { SetsigProviderProps } from "./context.js";

// Hooks
export { useSetsigKiosk } from "./hooks/useSetsigKiosk.js";
export type { UseSetsigKioskOptions, UseSetsigKioskReturn } from "./hooks/useSetsigKiosk.js";

export { useSetsigVerify } from "./hooks/useSetsigVerify.js";
export type { UseSetsigVerifyReturn } from "./hooks/useSetsigVerify.js";

export { useVisualProof } from "./hooks/useVisualProof.js";
export type { UseVisualProofReturn } from "./hooks/useVisualProof.js";

// Components
export { SetsigQRCode } from "./components/SetsigQRCode.js";
export type { SetsigQRCodeProps } from "./components/SetsigQRCode.js";

export { SetsigCameraCapture } from "./components/SetsigCameraCapture.js";
export type { SetsigCameraCaptureProps } from "./components/SetsigCameraCapture.js";

// Types
export type {
  SetsigConfig,
  KioskTokenData,
  Coordinates,
  VisualProofData,
  VerifySessionParams,
  VerifySessionResult,
} from "./types.js";

// Domain Errors & Paywall Exceptions
export * from "./errors.js";


