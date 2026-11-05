import type { VisualProofData } from "../types.js";
export interface UseVisualProofReturn {
    computeImageHash: (blob: Blob) => Promise<string>;
    acquireUploadUrl: (venueId: string) => Promise<{
        uploadUrl: string;
        storageKey: string;
    }>;
    uploadVisualProof: (venueId: string, imageBlob: Blob) => Promise<VisualProofData>;
    isUploading: boolean;
    error: string | null;
}
/**
 * useVisualProof computes Claim 10 SHA-256 digests on the client and uploads proofs.
 */
export declare function useVisualProof(): UseVisualProofReturn;
//# sourceMappingURL=useVisualProof.d.ts.map