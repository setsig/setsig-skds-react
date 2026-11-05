"use client";
import * as React from "react";
import { useSetsigContext } from "../context.js";
/**
 * useSetsigVerify executes atomic physical presence verification against the setsig engine.
 */
export function useSetsigVerify() {
    const { apiUrl, config } = useSetsigContext();
    const [isVerifying, setIsVerifying] = React.useState(false);
    const [lastResult, setLastResult] = React.useState(null);
    const [error, setError] = React.useState(null);
    const verify = React.useCallback(async (params) => {
        setIsVerifying(true);
        setError(null);
        try {
            const payload = {
                venue_id: params.venueId,
                token_id: params.tokenId,
                client_token: params.clientToken,
                latitude: params.coordinates.latitude,
                longitude: params.coordinates.longitude,
                accuracy: params.coordinates.accuracy,
            };
            if (params.coordinates.altitude !== undefined) {
                payload.altitude = params.coordinates.altitude;
            }
            if (params.visualProof) {
                payload.visual_proof = {
                    image_hash_sha256: params.visualProof.imageHashSha256,
                    storage_key: params.visualProof.storageKey,
                    captured_at: params.visualProof.capturedAt,
                    liveness_score: params.visualProof.livenessScore,
                };
            }
            if (params.attestationToken) {
                payload.attestation_token = params.attestationToken;
            }
            const res = await fetch(`${apiUrl}/v1/sessions/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${config.apiKey}`,
                },
                body: JSON.stringify(payload),
            });
            const envelope = await res.json();
            if (!res.ok) {
                const errMsg = envelope.error || envelope.message || "Verification rejected";
                const failedResult = {
                    status: "rejected",
                    sessionId: envelope.session_id || "",
                    distanceMeters: envelope.distance_meters || 0,
                    verifiedAt: new Date().toISOString(),
                    proofSignature: "",
                    error: errMsg,
                };
                setLastResult(failedResult);
                setError(errMsg);
                return failedResult;
            }
            const data = envelope.data || envelope;
            const successResult = {
                status: "verified",
                sessionId: data.session_id || data.sessionId,
                distanceMeters: data.distance_meters || data.distanceMeters || 0,
                verifiedAt: data.verified_at || data.verifiedAt || new Date().toISOString(),
                proofSignature: data.proof_signature || data.proofSignature || "",
            };
            setLastResult(successResult);
            return successResult;
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : "Verification network error";
            setError(msg);
            const errResult = {
                status: "rejected",
                sessionId: "",
                distanceMeters: 0,
                verifiedAt: new Date().toISOString(),
                proofSignature: "",
                error: msg,
            };
            setLastResult(errResult);
            return errResult;
        }
        finally {
            setIsVerifying(false);
        }
    }, [apiUrl, config.apiKey]);
    return {
        verify,
        isVerifying,
        lastResult,
        error,
    };
}
//# sourceMappingURL=useSetsigVerify.js.map