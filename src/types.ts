export interface SetsigConfig {
  apiKey: string;
  apiUrl?: string;
  tenantId?: string;
}

export interface KioskTokenData {
  tokenId: string;
  qrPayload: string;
  expiresAt: string;
  ttlRemaining: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
}

export interface VisualProofData {
  imageHashSha256: string;
  storageKey: string;
  capturedAt: string;
  livenessScore?: number;
}

export interface VerifySessionParams {
  venueId: string;
  tokenId: string;
  clientToken: string;
  coordinates: Coordinates;
  visualProof?: VisualProofData;
  attestationToken?: string;
}

export interface VerifySessionResult {
  status: "verified" | "rejected";
  sessionId: string;
  distanceMeters: number;
  verifiedAt: string;
  proofSignature: string;
  error?: string;
}

