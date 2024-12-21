import React, {useEffect} from "react";
import {createRoot} from "react-dom/client";
import {Configuration, PublicClientApplication} from "@azure/msal-browser";
import {AuthenticationProvider, AuthenticateContextData, LoginConfig} from "@enterprise_search/authentication";
import {loginUsingMsal} from "@enterprise_search/msal_authentication";
import {SimpleMustBeLoggedIn, useDisplayLogin} from "@enterprise_search/react_login_component";
import {ExampleInitialSearchResultsPlugin, SearchResultsPluginProvider, SearchResultsPlugins, useSearchResults} from "@enterprise_search/search_results_plugin";


import {emptySearchState} from "@enterprise_search/search_state";
import {filtersDisplayPurpose, ReactFiltersContextData, ReactFiltersProvider} from "@enterprise_search/react_filters_plugin";
import {exampleTimeFilterPlugin} from "@enterprise_search/react_time_filter_plugin";
import {DebugSearchState, SearchInfoProviderUsingUseState} from "@enterprise_search/react_search_state";
import {keywordsFilterName, simpleKeywordsFilterPlugin} from "@enterprise_search/react_keywords_filter_plugin";
import {Authenticate} from "@enterprise_search/authentication/src/authenticate";
import {SearchImportantComponentsProvider, simpleSearchImportantComponents} from "@enterprise_search/search_important_components";

export const exampleMsalConfig: Configuration = {
    auth: {
        clientId: process.env.REACT_MSAL_CLIENT_ID ?? "ec963ff8-b8c7-411e-80b1-9473d0390b3b",
        authority: `https://login.microsoftonline.com/b914a242-e718-443b-a47c-6b4c649d8c0a`,
        redirectUri: "/tile",
        postLogoutRedirectUri: "/",
    },
};
const msal = new PublicClientApplication(exampleMsalConfig);
const login: LoginConfig = loginUsingMsal({msal});

const searchResultsPlugins: SearchResultsPlugins = {
    'start': ExampleInitialSearchResultsPlugin,
}

const reactFiltersContextData: ReactFiltersContextData<any> = {
    plugins: {
        [keywordsFilterName]: simpleKeywordsFilterPlugin,
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
        <DisplayLogin/> {/* The headers go here */}
        <SearchResults/> {/* The main display */}
        {/* The footer goes here */}
    </div>
}

msal.initialize({}).then(() => {

    root.render(<React.StrictMode>
            <AuthenticationProvider loginConfig={login} >
                <SearchImportantComponentsProvider components={simpleSearchImportantComponents}>
                    <Authenticate NotLoggedIn={SimpleMustBeLoggedIn}>
                        <SearchInfoProviderUsingUseState allSearchState={emptySearchState}>
                            <SearchResultsPluginProvider plugins={searchResultsPlugins}>
                                <ReactFiltersProvider value={reactFiltersContextData}>
                                    <SearchApp initialPurpose='start'/>
                                    <DebugSearchState/>
                                </ReactFiltersProvider>
                            </SearchResultsPluginProvider>
                        </SearchInfoProviderUsingUseState>
                    </Authenticate>
                </SearchImportantComponentsProvider>
            </AuthenticationProvider>
        </React.StrictMode>
    );
})

