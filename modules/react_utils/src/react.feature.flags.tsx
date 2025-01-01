import {NameAnd} from "@enterprise_search/recoil_utils";
import {makeContextFor, makeContextForState} from "./react_utils";
import React, {useMemo} from "react";
import {lensBuilder} from "@enterprise_search/optics";
import {useWindowUrlData} from "@enterprise_search/routing";

export type FeatureFlag = {
    description: string
    value: boolean
}
export type FeatureFlags = NameAnd<FeatureFlag>

export const {use: useOriginalFeatureFlags, Provider: OriginalFeatureFlagsProvider} = makeContextFor<FeatureFlags, 'originalFeatureFlags'>('originalFeatureFlags');
export const {use: useFeatureFlagsState, Provider: FeatureFlagsStateProvider} = makeContextForState<FeatureFlags, 'featureFlags'>('featureFlags');

export function updateFeatureFlagsFromHRef(url: URL, featureFlags: FeatureFlags) {
    let copy: FeatureFlags = featureFlags
    const searchParams = new URLSearchParams(url.search);
    for (const key of Object.keys(featureFlags)) {
        if (searchParams.has(key)) {
            const lens = lensBuilder<FeatureFlags>().focusOn(key).focusOn('value')
            copy = lens.set(copy, searchParams.get(key) === 'true')
        }
    }
    return copy
}

export function clearAllFeatureFlags(featureFlags: FeatureFlags) {
    let copy: FeatureFlags = featureFlags
    for (const key of Object.keys(featureFlags)) {
        const lens = lensBuilder<FeatureFlags>().focusOn(key).focusOn('value')
        copy = lens.set(copy, false)
    }
    return copy
}

export function FeatureFlagsProvider({children, featureFlags}: { children: React.ReactNode, featureFlags: FeatureFlags }) {
    const [winUrlData] = useWindowUrlData()
    const initialState = useMemo<FeatureFlags>(() => {
        return updateFeatureFlagsFromHRef(winUrlData.url, featureFlags);
    }, [window.location.href, featureFlags]);
    return <OriginalFeatureFlagsProvider originalFeatureFlags={featureFlags}>
        <FeatureFlagsStateProvider featureFlags={initialState}>{children}</FeatureFlagsStateProvider>
    </OriginalFeatureFlagsProvider>
}

export function useFeatureFlag(name: string): boolean {
    const [flags] = useFeatureFlagsState();
    return flags[name]?.value ?? false;
}