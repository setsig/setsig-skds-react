import type { VerifySessionParams, VerifySessionResult } from "../types.js";
export interface UseSetsigVerifyReturn {
    verify: (params: VerifySessionParams) => Promise<VerifySessionResult>;
    isVerifying: boolean;
    lastResult: VerifySessionResult | null;
    error: string | null;
}
/**
 * useSetsigVerify executes atomic physical presence verification against the setsig engine.
 */
export declare function useSetsigVerify(): UseSetsigVerifyReturn;
//# sourceMappingURL=useSetsigVerify.d.ts.map