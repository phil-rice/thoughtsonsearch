import React, {useEffect} from "react";
import {createRoot} from "react-dom/client";
import {Configuration, PublicClientApplication} from "@azure/msal-browser";
import {Authenticate, AuthenticationProvider, LoginConfig} from "@enterprise_search/authentication";
import {loginUsingMsal} from "@enterprise_search/msal_authentication";
import {SimpleDisplayLogin, SimpleMustBeLoggedIn, useDisplayLogin} from "@enterprise_search/react_login_component";
import {ExampleInitialSearchResultsPlugin, SearchResultsPlugins, useSearchResults} from "@enterprise_search/search_results_plugin";


import {emptySearchState} from "@enterprise_search/search_state";
import {filtersDisplayPurpose, ReactFiltersContextData} from "@enterprise_search/react_filters_plugin";
import {exampleTimeFilterPlugin} from "@enterprise_search/react_time_filter_plugin";
import {DebugSearchState, SearchInfoProviderUsingUseState} from "@enterprise_search/react_search_state";
import {keywordsFilterName, simpleKeywordsFilterPlugin} from "@enterprise_search/react_keywords_filter_plugin";
import {SearchImportantComponents, SearchImportantComponentsProvider} from "@enterprise_search/search_important_components";


import {DataSourcePlugins} from "@enterprise_search/react_datasource_plugin";
import {DataPlugins} from "@enterprise_search/react_data/src/react.data";
import {SimpleSearchBar} from "@enterprise_search/search_bar";
import {simpleLoadingDisplay} from "@enterprise_search/loading";

export const exampleMsalConfig: Configuration = {
    auth: {
        clientId: process.env.REACT_MSAL_CLIENT_ID ?? "ec963ff8-b8c7-411e-80b1-9473d0390b3b",
        authority: `https://login.microsoftonline.com/b914a242-e718-443b-a47c-6b4c649d8c0a`,
        redirectUri: "/tile",
        postLogoutRedirectUri: "/",
    },
};
const msal = new PublicClientApplication(exampleMsalConfig);
const login: LoginConfig = loginUsingMsal({msal,debug:false});

const searchResultsPlugins: SearchResultsPlugins = {
    'start': ExampleInitialSearchResultsPlugin,
}

const reactFiltersContextData: ReactFiltersContextData<any, any> = {
    plugins: {
        [keywordsFilterName]: simpleKeywordsFilterPlugin,
        'time': exampleTimeFilterPlugin
    },
    PurposeToFilterLayout: {
        [filtersDisplayPurpose]: ({children}) => <div><h3>Filters</h3>{children}</div>
    }
}
const dataSourcePlugins: DataSourcePlugins<any> = {}
const dataPlugins: DataPlugins = {}

const searchImportComponents: SearchImportantComponents<any, any> = {
    SearchBar: SimpleSearchBar,
    searchResultsPlugins,
    dataSourcePlugins,
    dataPlugins,
    filterPlugins: reactFiltersContextData,
    LoadingDisplay: simpleLoadingDisplay,
    displayLogin: SimpleDisplayLogin,
    NotLoggedIn: SimpleMustBeLoggedIn
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
            <SearchImportantComponentsProvider components={searchImportComponents}>
                <SearchInfoProviderUsingUseState allSearchState={emptySearchState}>
                    <AuthenticationProvider loginConfig={login}>
                        <Authenticate>
                            <SearchApp initialPurpose='start'/>
                            <DebugSearchState/>
                        </Authenticate>
                    </AuthenticationProvider>
                </SearchInfoProviderUsingUseState>
            </SearchImportantComponentsProvider>
        </React.StrictMode>
    );
})

