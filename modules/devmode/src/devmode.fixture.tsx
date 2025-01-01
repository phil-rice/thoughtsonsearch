// Reuse the renderDevMode function from your setup
import {DebugState} from "@enterprise_search/recoil_utils";
import {DevMode, DevModeComponent, DevModeComponents, DevModeComponentsProvider, DevModeStateForSearchProvider, SearchDevModeComponents} from "./devmode";
import {makeSimpleNavBar} from "@enterprise_search/navbar";
import {render} from "@testing-library/react";
import {DebugStateProvider, FeatureFlagsProvider} from "@enterprise_search/react_utils";
import {WindowUrlContext} from "@enterprise_search/routing";
import {SearchInfoProviderUsingUseState} from "@enterprise_search/react_search_state";
import {UserDataProvider} from "@enterprise_search/react_login_component";
import React from "react";

const mockUserData = {
    email: "user@example.com",
    isDev: true,
    isAdmin: false,
    loggedIn: true
};

const mockSearchState = {
    searches: {
        main: {count: 0, filters: {}, dataSourceToSearchResult: {}},
        immediate: {count: 0, filters: {}, dataSourceToSearchResult: {}}
    }
};
const mockFeatureFlags = {
    featureX: {value: true, description: "Enable Feature X"}
};

const mockDebugState: DebugState = {
    search: true,
    userData: true,
};

const Name1Component: DevModeComponent = () => <span>Dev Mode 1 Component</span>
const Name2Component: DevModeComponent = () => <span>Dev Mode 2 Component</span>
const testDevModeDisplayComponents: DevModeComponents = {
    name1: Name1Component,
    name2: Name2Component
}

export const testDevModeComponents: SearchDevModeComponents = {
    DevModeNavBar: makeSimpleNavBar('devmode', Object.keys(testDevModeDisplayComponents)),
    components: testDevModeDisplayComponents
}
type DevModeFixtureProps = {
    url: string;
    userData?: typeof mockUserData;
    searchState?: typeof mockSearchState;
    selected: string
    children: React.ReactNode;
};
export const DevModeFixture: React.FC<DevModeFixtureProps> = ({
                                                                  url,
                                                                  selected,
                                                                  userData = mockUserData,
                                                                  searchState = mockSearchState,

                                                                  children
                                                              }) => {
    const urlData = {url: new URL(url), parts: ['ignore']};

    return (
        <DebugStateProvider debugState={mockDebugState}>
            <WindowUrlContext.Provider value={[urlData, () => {}]}>
                <FeatureFlagsProvider featureFlags={mockFeatureFlags}>
                    <SearchInfoProviderUsingUseState allSearchState={searchState}>
                        <UserDataProvider userData={userData}>
                            <DevModeComponentsProvider components={testDevModeComponents}>
                                <DevModeStateForSearchProvider devModeState={{selected}}>
                                    {children}
                                </DevModeStateForSearchProvider>
                            </DevModeComponentsProvider>
                        </UserDataProvider>
                    </SearchInfoProviderUsingUseState>
                </FeatureFlagsProvider>
            </WindowUrlContext.Provider>
        </DebugStateProvider>
    );
};
