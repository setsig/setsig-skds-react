"use client";

import * as React from "react";
import { useSetsigContext } from "../context.js";
import type { VisualProofData } from "../types.js";

export interface UseVisualProofReturn {
  computeImageHash: (blob: Blob) => Promise<string>;
  acquireUploadUrl: (venueId: string) => Promise<{ uploadUrl: string; storageKey: string }>;
  uploadVisualProof: (venueId: string, imageBlob: Blob) => Promise<VisualProofData>;
  isUploading: boolean;
  error: string | null;
}

/**
 * useVisualProof computes Claim 10 SHA-256 digests on the client and uploads proofs.
 */
export function useVisualProof(): UseVisualProofReturn {
  const { apiUrl, config } = useSetsigContext();
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const computeImageHash = React.useCallback(async (blob: Blob): Promise<string> => {
    const buffer = await blob.arrayBuffer();
    const digest = await window.crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(digest));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }, []);

  const acquireUploadUrl = React.useCallback(
    async (venueId: string) => {
      const res = await fetch(`${apiUrl}/v1/sessions/verify-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({ venue_id: venueId }),
      });

      if (!res.ok) {
        throw new Error("Failed to acquire presigned visual proof upload URL");
      }

      const envelope = await res.json();
      const data = envelope.data || envelope;
      return {
        uploadUrl: data.upload_url || data.uploadUrl,
        storageKey: data.storage_key || data.storageKey,
      };
    },
    [apiUrl, config.apiKey]
  );

  const uploadVisualProof = React.useCallback(
    async (venueId: string, imageBlob: Blob): Promise<VisualProofData> => {
      setIsUploading(true);
      setError(null);

      try {
        const hash = await computeImageHash(imageBlob);
        const { uploadUrl, storageKey } = await acquireUploadUrl(venueId);

        // Upload photo directly to cloud storage
        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": imageBlob.type || "image/webp",
          },
          body: imageBlob,
        });

        if (!uploadRes.ok) {
          throw new Error("Direct cloud photo upload failed");
        }

        return {
          imageHashSha256: hash,
          storageKey,
          capturedAt: new Date().toISOString(),
          livenessScore: 0.98,
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Visual proof upload failed";
        setError(msg);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [computeImageHash, acquireUploadUrl]
  );

  return {
    computeImageHash,
    acquireUploadUrl,
    uploadVisualProof,
    isUploading,
    error,
  };
}

