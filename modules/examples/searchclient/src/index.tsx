import React, {useEffect} from "react";
import {createRoot} from "react-dom/client";
import {Configuration, PublicClientApplication} from "@azure/msal-browser";
import {LoginProvider, RawLoginOps} from "@enterprise_search/authentication";
import {loginUsingMsal} from "@enterprise_search/msal_authentication";
import {useDisplayLogin} from "@enterprise_search/react_login_component/src/react.login";
import {ExampleInitialSearchResultsPlugin, SearchResultsPluginProvider, SearchResultsPlugins, useSearchResults} from "@enterprise_search/search_results_plugin";


import {emptySearchState} from "@enterprise_search/search_state";
import {filtersDisplayPurpose, ReactFiltersContextData, ReactFiltersProvider} from "@enterprise_search/react_filters_plugin";
import {exampleTimeFilterPlugin} from "@enterprise_search/react_time_filter";
import {exampleKeywordsFilterPlugin, keywordsFilterName, SimpleSearchBar} from "@enterprise_search/react_keywords_filter";
import {DebugSearchState, SearchInfoProviderUsingUseState} from "@enterprise_search/react_search_state";
import {SearchBarProvider} from "@enterprise_search/search_bar";

export const exampleMsalConfig: Configuration = {
    auth: {
        clientId: process.env.REACT_MSAL_CLIENT_ID ?? "ec963ff8-b8c7-411e-80b1-9473d0390b3b",
        authority: `https://login.microsoftonline.com/b914a242-e718-443b-a47c-6b4c649d8c0a`,
        redirectUri: "/tile",
        postLogoutRedirectUri: "/",
    },
};
const msal = new PublicClientApplication(exampleMsalConfig);
const login: RawLoginOps = loginUsingMsal({msal})

const searchResultsPlugins: SearchResultsPlugins = {
    'start': ExampleInitialSearchResultsPlugin,
}

const reactFiltersContextData: ReactFiltersContextData = {
    plugins: {
        [keywordsFilterName]: exampleKeywordsFilterPlugin,
        'time': exampleTimeFilterPlugin
    },
    PurposeToFilterLayout: {
        [filtersDisplayPurpose]: ({children}) => <div><h3>Filters</h3>{children}</div>
    }
}
const root = createRoot(document.getElementById('root') as HTMLElement);


type SearchAppProps = {
    initialPurpose: string
}


function SearchApp({initialPurpose}: SearchAppProps) {
    const {DisplayLogin} = useDisplayLogin()
    const [purpose, setPurpose] = React.useState(initialPurpose)
    const {SearchResults} = useSearchResults(purpose)
    useEffect(() => document.querySelector("input")?.focus(), []); // Focus on the first input

    return <div>
        <DisplayLogin/>
        <SearchResults/>
    </div>
}

msal.initialize({}).then(() => {

    root.render(<React.StrictMode>
            <LoginProvider login={login}>
                <SearchBarProvider SearchBar={SimpleSearchBar}>
                    <SearchInfoProviderUsingUseState allSearchState={emptySearchState}>
                        <SearchResultsPluginProvider plugins={searchResultsPlugins}>
                            <ReactFiltersProvider value={reactFiltersContextData}>
                                <SearchApp initialPurpose='start'/>
                                <DebugSearchState/>
                            </ReactFiltersProvider>
                        </SearchResultsPluginProvider>
                    </SearchInfoProviderUsingUseState>
                </SearchBarProvider>
            </LoginProvider>
        </React.StrictMode>
    );
})

