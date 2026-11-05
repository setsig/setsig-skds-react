"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
const SetsigContext = React.createContext(null);
/**
 * SetsigProvider supplies client API keys and endpoint configuration to setsig hooks.
 * Next.js App Router and React 18/19 compatible.
 */
export function SetsigProvider({ apiKey, apiUrl = "https://api.setsig.com", tenantId, children, }) {
    const value = React.useMemo(() => ({
        config: { apiKey, apiUrl, tenantId },
        apiUrl: apiUrl.replace(/\/$/, ""),
    }), [apiKey, apiUrl, tenantId]);
    return _jsx(SetsigContext.Provider, { value: value, children: children });
}
export function useSetsigContext() {
    const context = React.useContext(SetsigContext);
    if (!context) {
        throw new Error("useSetsigContext must be used within a <SetsigProvider />");
    }
    return context;
}
//# sourceMappingURL=context.js.map