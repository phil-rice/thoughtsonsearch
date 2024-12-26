import {FeatureFlags, FeatureFlagsProvider} from "./react.feature.flags";
import {DebugState, DebugStateProvider} from "./react.debug";
import React, {ReactNode} from "react";


export type NonFunctionalsProviderProps = {
    debugState: DebugState
    featureFlags: FeatureFlags
    children: ReactNode
}

export function NonFunctionalsProvider({debugState, featureFlags, children}: NonFunctionalsProviderProps) {
    return <DebugStateProvider debugState={debugState}>
        <FeatureFlagsProvider featureFlags={featureFlags}>
            {children}
        </FeatureFlagsProvider>
    </DebugStateProvider>
}