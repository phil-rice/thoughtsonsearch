import {NameAnd} from "@enterprise_search/recoil_utils";
import {makeContextForState} from "./react_utils";

export type FeatureFlag = {
    description: string
    value: boolean
}
export type FeatureFlags = NameAnd<FeatureFlag>

export const {use: useFeatureFlags, Provider: FeatureFlagsProvider} = makeContextForState<FeatureFlags, 'featureFlags'>('featureFlags');

export function useFeatureFlag(name: string): boolean {
    const flags = useFeatureFlags();
    return flags[name]?.value ?? false;
}