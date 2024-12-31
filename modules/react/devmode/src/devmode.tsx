import {useSearchGuiState} from "@enterprise_search/search_gui_state";
import React, {ReactElement} from "react";
import {NameAnd} from "@enterprise_search/recoil_utils";
import {makeContextFor, makeContextForState, makeUseStateChild} from "@enterprise_search/react_utils";

import {DevModeSearchState} from "./devModeSearchState";
import {makeSimpleNavBar, NavBar} from "@enterprise_search/navbar";
import {DevModeDebug} from "./devmode.debug";
import {DevModeFeatureFlags} from "./devmode.feature.flags";
import {useUserData} from "@enterprise_search/react_login_component/src/authenticationProvider";
import {DevModeSovereignState} from "./devModeSovereignState";

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
    UserData: DevModeUserData,
    Debug: DevModeDebug,
    FeatureFlags: DevModeFeatureFlags,
    Sovereign: DevModeSovereignState
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
    return <pre>{JSON.stringify(userData, null, 2)}</pre>
}

export function DevMode() {
    const userData = useUserData()
    const {DevModeNavBar, components} = useDevModeComponents()
    const selectedOps = useDevModeSelected()
    const allowed = userData.isDev || userData.isAdmin
    if (!allowed || window.location.href.indexOf('devMode') === -1) return <></>
    const [selected] = selectedOps
    const Component = components[selected] || (() => <></>)
    return <div className='dev-mode'>
        <hr/>
        <DevModeNavBar selectedOps={selectedOps}/>
        <Component/>
    </div>
}