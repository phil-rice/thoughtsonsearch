import React, {createContext, useMemo, useState} from "react";
import {GetterSetter} from "@enterprise_search/react_utils";
import {lensBuilder} from "@enterprise_search/optics";
import {makeGetterSetter} from "@enterprise_search/optics/src/lens.getter.setters";

export type SovereignProps = {}
export type Sovereign = (props: SovereignProps) => React.ReactElement

/** Sovereign state is a generic that is a record from the soverign name to the state of that sovereign
 * At the moment we operate on the assumption they are not reentrant*/
export type SovereignSelectionState<SovereignState> = {
    /* The name of the sovereign selected */
    selected: keyof SovereignState
    state: SovereignState
}

export type SovereignSelectionStateOps<SovereignState> = {
    stateOps: GetterSetter<SovereignSelectionState<SovereignState>>
    selectedOps: GetterSetter<keyof SovereignState>
    pageOps: <Page extends keyof SovereignState>(page: Page) => GetterSetter<SovereignState[Page]>
}
export const SovereignStateContext = createContext<SovereignSelectionStateOps<any> | undefined>(undefined)

export type SovereignStateProviderProps<SovereignState> = {
    children: React.ReactNode
    state: SovereignSelectionState<SovereignState>
}

export function SovereignStateProviderFromUseState<SovereignState>({children, state: initial}: SovereignStateProviderProps<SovereignState>) {
    const [state, setState] = useState(initial)
    const ops: SovereignSelectionStateOps<SovereignState> = useMemo(() => {
        const idL = lensBuilder<SovereignSelectionState<SovereignState>>()
        const selectedL = idL.focusOn("selected")
        const stateL = idL.focusOn("state")
        const stateOps: GetterSetter<SovereignSelectionState<SovereignState>> = [state, setState]
        const selectedOps = makeGetterSetter(state, setState, selectedL)
        const pageOps =
            <Page extends keyof SovereignState>(page: Page) =>
                makeGetterSetter(state, setState, stateL.focusOn(page))
        return {stateOps, selectedOps, pageOps}
    }, [state, setState])
    return <SovereignStateContext.Provider value={ops}>{children}</SovereignStateContext.Provider>
}


export function useSovereignState<SovereignState>(): GetterSetter<SovereignSelectionState<SovereignState>> {
    const {stateOps} = React.useContext(SovereignStateContext) || {}
    if (!stateOps) throw new Error("useSovereignState must be used within a SovereignStateProvider")
    return stateOps
}

export function useSelectedSovereign<SovereignState>(): GetterSetter<keyof SovereignState> {
    const {selectedOps} = React.useContext(SovereignStateContext) || {}
    if (!selectedOps) throw new Error("useSelectedSovereign must be used within a SovereignStateProvider")
    return selectedOps as GetterSetter<keyof SovereignState> //Need this because the context is an <any> for SovereignState
}

export function useSovereignPage<SovereignState, Page extends keyof SovereignState>(page: Page): GetterSetter<SovereignState[Page]> {
    const {pageOps} = React.useContext(SovereignStateContext) || {}
    if (!pageOps) throw new Error("useSovereignPage must be used within a SovereignStateProvider")
    return pageOps(page)
}