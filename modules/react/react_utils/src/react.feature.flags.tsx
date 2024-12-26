import {NameAnd} from "@enterprise_search/recoil_utils";
import {makeContextForState} from "./react_utils";
import React, {useMemo} from "react";
import {lensBuilder} from "@enterprise_search/optics";

export type FeatureFlag = {
    description: string
    value: boolean
}
export type FeatureFlags = NameAnd<FeatureFlag>

export const {use: useFeatureFlagsState, Provider: FeatureFlagsStateProvider} = makeContextForState<FeatureFlags, 'featureFlags'>('featureFlags');

export function FeatureFlagsProvider({children, featureFlags}: { children: React.ReactNode, featureFlags: FeatureFlags }) {
    const initialState = useMemo<FeatureFlags>(() => {
        let copy: FeatureFlags = featureFlags
        const searchParams = new URLSearchParams(window.location.search);
        for (const key of Object.keys(featureFlags)) {
            if (searchParams.has(key)) {
                const lens = lensBuilder<FeatureFlags>().focusOn(key).focusOn('value')
                copy = lens.set(copy, searchParams.get(key) === 'true')
            }
        }
        return copy
    }, [window.location.href, featureFlags]);
    return <FeatureFlagsStateProvider featureFlags={initialState}>{children}</FeatureFlagsStateProvider>;
}

export function useFeatureFlag(name: string): boolean {
    const flags = useFeatureFlagsState();
    return flags[name]?.value ?? false;
}