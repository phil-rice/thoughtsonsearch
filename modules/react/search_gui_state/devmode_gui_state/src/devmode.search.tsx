import {useSearchGuiState} from "@enterprise_search/search_gui_state";
import React, {ReactElement} from "react";
import {NameAnd} from "@enterprise_search/recoil_utils";
import {makeContextFor, makeContextForState, makeUseStateChild} from "@enterprise_search/react_utils";
import {useUserData} from "@enterprise_search/authentication";
import {DevModeSearchState} from "./devModeSearchState";
import { makeSimpleNavBar, NavBar} from "@enterprise_search/navbar";

export type DevModeComponent = () => React.ReactElement;
export type DevModeNavbarComponent = () => ReactElement;

export type DevModeNavItemProps = { name: string, }
export type DevModeNavItem = (props: DevModeNavItemProps) => React.ReactElement;
export type DevModeComponents = NameAnd<DevModeComponent>

export type SearchDevModeComponents = {
    DevModeNavBar: NavBar
    components: DevModeComponents
}

const debugComponents = {
    GuiState: DevModeGuiState,
    SearchState: DevModeSearchState,
    UserData: DevModeUserData
};
export const simpleDevModeComponents: SearchDevModeComponents = {
    DevModeNavBar: makeSimpleNavBar('devmode', Object.keys(debugComponents)),
    components: debugComponents
}
export const {Provider: DevModeComponentsProvider, use: useDevModeComponents} = makeContextFor('components', simpleDevModeComponents)
export type DevModeState = {
    selected: string
}
export const {Provider: DevModeForSearchProvider, use: useDevModeState} = makeContextForState<DevModeState, 'devModeState'>('devModeState')
export const useDevModeSelected = makeUseStateChild(useDevModeState, id => id.focusOn('selected'))

export function DevModeGuiState() {
    const [searchState] = useSearchGuiState()
    return <pre>{JSON.stringify(searchState, null, 2)}</pre>
}

export function DevModeUserData() {
    const userData = useUserData()
    return <pre>x{JSON.stringify(userData, null, 2)}</pre>
}
