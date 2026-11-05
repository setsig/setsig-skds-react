"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useVisualProof } from "../hooks/useVisualProof.js";
/**
 * SetsigCameraCapture captures a photo via WebRTC camera and produces a Claim 10 SHA-256 visual proof.
 */
export function SetsigCameraCapture({ venueId, onCaptured, onError, className = "", }) {
    const videoRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const [streamActive, setStreamActive] = React.useState(false);
    const [permissionError, setPermissionError] = React.useState(null);
    const { uploadVisualProof, isUploading, error: uploadError } = useVisualProof();
    // Initialize camera stream
    React.useEffect(() => {
        let stream = null;
        async function initCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
                    audio: false,
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                    setStreamActive(true);
                }
            }
            catch (err) {
                const msg = err instanceof Error ? err.message : "Camera permission denied";
                setPermissionError(msg);
                onError?.(msg);
            }
        }
        void initCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [onError]);
    const handleCapture = async () => {
        if (!videoRef.current || !canvasRef.current || !streamActive || isUploading)
            return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
            if (!blob)
                return;
            try {
                const proof = await uploadVisualProof(venueId, blob);
                onCaptured(proof);
            }
            catch (err) {
                const msg = err instanceof Error ? err.message : "Visual proof capture failed";
                onError?.(msg);
            }
        }, "image/webp", 0.9);
    };
    return (_jsxs("div", { className: `relative flex flex-col items-center overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 ${className}`, children: [_jsx("canvas", { ref: canvasRef, className: "hidden" }), permissionError ? (_jsxs("div", { className: "flex flex-col items-center justify-center p-8 text-center text-red-400 text-xs", children: [_jsx("p", { className: "font-semibold mb-1", children: "Camera Access Blocked" }), _jsx("p", { className: "text-zinc-500", children: permissionError })] })) : (_jsxs(_Fragment, { children: [_jsx("video", { ref: videoRef, playsInline: true, muted: true, className: "w-full h-auto object-cover aspect-video" }), _jsx("div", { className: "absolute bottom-4 left-0 right-0 flex justify-center items-center gap-3 px-4", children: _jsx("button", { type: "button", onClick: handleCapture, disabled: !streamActive || isUploading, className: "px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-xs shadow-lg hover:bg-blue-500 disabled:opacity-50 transition-all flex items-center gap-2", children: isUploading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" }), _jsx("span", { children: "Computing SHA-256..." })] })) : (_jsx("span", { children: "Capture Visual Proof" })) }) })] })), uploadError && (_jsx("div", { className: "p-2 text-[11px] text-red-400 bg-red-950/40 w-full text-center border-t border-red-900/50", children: uploadError }))] }));
}
//# sourceMappingURL=SetsigCameraCapture.js.map