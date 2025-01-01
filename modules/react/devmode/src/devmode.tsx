import React, {ReactElement} from "react";
import {NameAnd} from "@enterprise_search/recoil_utils";
import {makeContextFor, makeContextForState, makeUseStateChild} from "@enterprise_search/react_utils";

import {DevModeSearchState} from "./devmode.search.state";
import {makeSimpleNavBar, NavBar} from "@enterprise_search/navbar";
import {DevModeDebug} from "./devmode.debug";
import {DevModeFeatureFlags} from "./devmode.feature.flags";
import {DevModeSovereignState} from "./devModeSovereignState";
import {useUserData} from "@enterprise_search/react_login_component";
import {useWindowUrlData} from "@enterprise_search/routing";
import {DevModeUserData} from "./devMode.user.data";
import {DevModeGuiState} from "./devmode.gui.state";

export type DevModeComponent = () => React.ReactElement;
export type DevModeNavbarComponent = () => ReactElement;

export type DevModeNavItemProps = { name: string, }
export type DevModeNavItem = (props: DevModeNavItemProps) => React.ReactElement;
export type DevModeComponents = NameAnd<DevModeComponent>

export type SearchDevModeComponents = {
    DevModeNavBar: NavBar
    components: DevModeComponents
}

const devModeComponents = {
    GuiState: DevModeGuiState,
    SearchState: DevModeSearchState,
    UserData: DevModeUserData,
    Debug: DevModeDebug,
    FeatureFlags: DevModeFeatureFlags,
    Sovereign: DevModeSovereignState
};
export const simpleDevModeComponents: SearchDevModeComponents = {
    DevModeNavBar: makeSimpleNavBar('devmode', Object.keys(devModeComponents)),
    components: devModeComponents
}
export const {Provider: DevModeComponentsProvider, use: useDevModeComponents} = makeContextFor('components', simpleDevModeComponents as SearchDevModeComponents)
export type DevModeState = {
    selected: string
}
export const {Provider: DevModeStateForSearchProvider, use: useDevModeState} = makeContextForState<DevModeState, 'devModeState'>('devModeState')
export const useDevModeSelected = makeUseStateChild(useDevModeState, id => id.focusOn('selected'))

export function DevMode() {
    const userData = useUserData()
    const [urlData] = useWindowUrlData()
    const {DevModeNavBar, components} = useDevModeComponents()
    const selectedOps = useDevModeSelected()
    const allowedbyUserType = userData.isDev || userData.isAdmin
    const devModeReqestedAndAllowed = allowedbyUserType && urlData.url.searchParams.get('devMode');
    if (!devModeReqestedAndAllowed) return <></>;
    const [selected] = selectedOps
    const Component = components[selected] || (() => <></>)
    return <div className='dev-mode'>
        <hr/>
        <DevModeNavBar selectedOps={selectedOps}/>
        <Component/>
    </div>
}