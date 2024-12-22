import React, {createContext, useMemo, useState} from "react";
import {GetterSetter} from "@enterprise_search/react_utils";
import {lensBuilder} from "@enterprise_search/optics";
import {makeGetterSetter} from "@enterprise_search/optics";
import {SovereignSelectionState} from "./sovereign.selection.state";

export type SovereignSelectionStateOps<SovereignState> = {
    allStateOps: GetterSetter<SovereignSelectionState<SovereignState>>
    selectedOps: GetterSetter<keyof SovereignState>
}
export type PageOps<SovereignState> = <Page extends keyof SovereignState>(page: Page) => GetterSetter<SovereignState[Page]>

export type SovereignStateContextType<SovereignState> = {
    stateOps: SovereignSelectionStateOps<SovereignState>
    pageOps: PageOps<SovereignState>
}
export const SovereignStateContext = createContext<SovereignStateContextType<any> | undefined>(undefined)

export type SovereignStateProviderProps<SovereignState> = {
    children: React.ReactNode
    state: SovereignSelectionState<SovereignState>
}

export function SovereignStateProviderFromUseState<SovereignState>({children, state: initial}: SovereignStateProviderProps<SovereignState>) {
    const [state, setState] = useState(initial)
    const value = useMemo(() => {
        const idL = lensBuilder<SovereignSelectionState<SovereignState>>()
        const selectedL = idL.focusOn("selected")
        const stateL = lensBuilder<SovereignSelectionState<SovereignState>>().focusOn("state")

        const allStateOps: GetterSetter<SovereignSelectionState<SovereignState>> = [state, setState]
        const selectedOps = makeGetterSetter(state, setState, selectedL)

        const pageOps: PageOps<SovereignState> = <Page extends keyof SovereignState>(page: Page) =>
            makeGetterSetter(state, setState, stateL.focusOn(page))
        const stateOps: SovereignSelectionStateOps<SovereignState> = {allStateOps, selectedOps}
        return {stateOps, pageOps}
    }, [state, setState])


    return <SovereignStateContext.Provider value={value}>{children}</SovereignStateContext.Provider>
}

export function useSovereignState<SovereignState>(): GetterSetter<SovereignSelectionState<SovereignState>> {
    const {stateOps} = React.useContext(SovereignStateContext) || {}
    if (!stateOps) throw new Error("useSovereignState must be used within a SovereignStateProvider")
    return stateOps.allStateOps
}

export function useSelectSovereign<SovereignState>(): GetterSetter<keyof SovereignState> {
    const {stateOps} = React.useContext(SovereignStateContext) || {}
    if (!stateOps) throw new Error("useSovereignState must be used within a SovereignStateProvider")
    return stateOps.selectedOps as GetterSetter<keyof SovereignState>
}

export function useSovereignStatePageData<SovereignState, Page extends keyof SovereignState>(page: Page): GetterSetter<SovereignState[Page]> {
    const {pageOps} = React.useContext(SovereignStateContext) || {}
    if (!pageOps) throw new Error("useSovereignState must be used within a SovereignStateProvider")
    return pageOps(page)
}

export function useSovereignSelectedPageData<SovereignState>(): GetterSetter<SovereignState[any]> {
    const [selected] = useSelectSovereign<SovereignState>()
    const pageOps = useSovereignStatePageData<SovereignState, typeof selected>(selected)
    return pageOps
}