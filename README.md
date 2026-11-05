# @setsig/react

Official [setsig.com](https://setsig.com) React & Next.js Client SDK for Proof-of-Physical-Presence verification, dynamic kiosk displays, and forensic camera capture.

Designed specifically for **Next.js 14, 15, and 16 (App Router)** and **React 18 & 19** with zero hydration mismatch and native `"use client";` bundling.

---

## 📦 Installation

```bash
npm install @setsig/react
# or
pnpm add @setsig/react
# or
yarn add @setsig/react
```

---

## 🚀 Quick Start

### 1. Configure the Provider

Wrap your application or page with `<SetsigProvider>`:

```tsx
// app/providers.tsx or main.tsx
"use client";

import { SetsigProvider } from "@setsig/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SetsigProvider
      apiKey={process.env.NEXT_PUBLIC_SETSIG_API_KEY!}
      apiUrl="https://api.setsig.com"
    >
      {children}
    </SetsigProvider>
  );
}
```

---

### 2. Kiosk Display (Dynamic Self-Refreshing QR)

Use `<SetsigQRCode />` to render an auto-refreshing dynamic TOTP code with a circular countdown ring:

```tsx
"use client";

import { SetsigQRCode } from "@setsig/react";

export function KioskScreen({ venueId }: { venueId: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-lg font-bold">Scan to Verify Presence</h2>
      <SetsigQRCode
        venueId={venueId}
        size={300}
        refreshIntervalSeconds={60}
      />
    </div>
  );
}
```

Or consume the raw token and timer via the `useSetsigKiosk` hook:

```tsx
const { tokenData, secondsRemaining, isLoading, refresh } = useSetsigKiosk({
  venueId: "ven_workshop_01",
  refreshIntervalSeconds: 60,
});
```

---

### 3. Verify Presence from Mobile Browser

```tsx
"use client";

import { useSetsigVerify } from "@setsig/react";

export function CheckInButton({ venueId, tokenId }: { venueId: string; tokenId: string }) {
  const { verify, isVerifying, lastResult, error } = useSetsigVerify();

  const handleCheckIn = async () => {
    // 1. Get browser geolocation
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const result = await verify({
        venueId,
        tokenId,
        clientToken: `clt_${Date.now()}`,
        coordinates: {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        },
      });

      if (result.status === "verified") {
        alert(`Presence Verified! Distance: ${result.distanceMeters}m`);
      }
    });
  };

  return (
    <button onClick={handleCheckIn} disabled={isVerifying}>
      {isVerifying ? "Verifying Presence..." : "Check In Now"}
    </button>
  );
}
```

---

### 4. Forensic Visual Proof Capture (Claim 10 SHA-256)

```tsx
"use client";

import { SetsigCameraCapture } from "@setsig/react";

export function PhotoVerification({ venueId }: { venueId: string }) {
  return (
    <SetsigCameraCapture
      venueId={venueId}
      onCaptured={(proof) => {
        console.log("SHA-256 Digest:", proof.imageHashSha256);
        console.log("Storage Key:", proof.storageKey);
      }}
      onError={(err) => console.error("Camera Error:", err)}
    />
  );
}
```

---

## 🛡️ Next.js & React 19 Guarantee

- **RSC Compliant:** All components and hooks include `"use client";` directives.
- **Hydration Safe:** Timers and WebRTC streams initialize only after client-side hydration, preventing Next.js `Hydration failed` warnings.
- **Strict TypeScript:** 100% typed with `.d.ts` declaration maps.

---

## 📄 License

Apache-2.0 © setsig.com & AVCI Ventures

