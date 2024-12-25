import {useSearchGuiState} from "@enterprise_search/search_gui_state";
import React, {ReactElement} from "react";
import {NameAnd} from "@enterprise_search/recoil_utils";
import {makeContextFor, makeContextForState, makeUseStateChild} from "@enterprise_search/react_utils";
import {useUserData} from "@enterprise_search/authentication";
import {DevModeSearchState} from "./devModeSearchState";

export type DevModeComponent = () => React.ReactElement;
export type DevModeNavbarComponent = () => ReactElement;

export type DevModeNavItemProps = { name: string, }
export type DevModeNavItem = (props: DevModeNavItemProps) => React.ReactElement;
export type DevModeComponents = NameAnd<DevModeComponent>

export type SearchDevModeComponents = {
    DevModeNavBar: DevModeNavbarComponent
    DevModeNavItem: DevModeNavItem
    components: DevModeComponents
}

export const simpleDevModeComponents: SearchDevModeComponents = {
    DevModeNavBar: SimpleDevModeNavBar,
    DevModeNavItem: SimpleDevModeNavItem,
    components: {
        GuiState: DevModeGuiState,
        SearchState: DevModeSearchState,
        UserData: DevModeUserData
    }
}
export const {Provider: DevModeComponentsProvider, use: useDevModeComponents} = makeContextFor('components', simpleDevModeComponents)
export type DevModeState = {
    selected: string
}
export const {Provider: DevModeForSearchProvider, use: useDevModeState} = makeContextForState<DevModeState, 'devModeState'>('devModeState')
export const useDevModeSelected = makeUseStateChild(useDevModeState, id => id.focusOn('selected'))

export function SimpleDevModeNavBar() {
    const {DevModeNavItem, components} = useDevModeComponents();
    return <nav className={"dev-mode-navbar"}>{Object.entries(components).map(([key, component]) =>
        <DevModeNavItem key={key} name={key}/>)}</nav>
}

export function SimpleDevModeNavItem({name}: { name: string }) {
    const [selected, setSelected] = useDevModeSelected();
    return <button className='devmode-nav-item' onClick={() => setSelected(name)}>{name}</button>
}

export function DevModeGuiState() {
    const [searchState] = useSearchGuiState()
    return <pre>{JSON.stringify(searchState, null, 2)}</pre>
}

export function DevModeUserData() {
    const userData = useUserData()
    return <pre>x{JSON.stringify(userData, null, 2)}</pre>
}
