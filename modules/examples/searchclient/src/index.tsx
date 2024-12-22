import React, {useEffect} from "react";
import {createRoot} from "react-dom/client";
import {Configuration, PublicClientApplication} from "@azure/msal-browser";
import {Authenticate, AuthenticationProvider, LoginConfig} from "@enterprise_search/authentication";
import {loginUsingMsal} from "@enterprise_search/msal_authentication";
import {SimpleDisplayLogin, SimpleMustBeLoggedIn, useDisplayLogin} from "@enterprise_search/react_login_component";
import {ExampleInitialSearchResultsPlugin, SearchResultsPlugins, useSearchResults} from "@enterprise_search/search_results_plugin";


import {emptySearchState} from "@enterprise_search/search_state";
import {filtersDisplayPurpose, ReactFiltersContextData} from "@enterprise_search/react_filters_plugin";
import {exampleTimeFilterPlugin, timefilterPluginName, TimeFilters} from "@enterprise_search/react_time_filter_plugin";
import {DebugSearchState, SearchInfoProviderUsingUseState} from "@enterprise_search/react_search_state";
import {KeywordsFilter, keywordsFilterName, simpleKeywordsFilterPlugin} from "@enterprise_search/react_keywords_filter_plugin";
import {SearchImportantComponents, SearchImportantComponentsProvider} from "@enterprise_search/search_important_components";


// import {elasticSearchDataSourcePlugin, keywordsFilterToElasticSearchFilter} from "@enterprise_search/search_elastic";
import {DataSourcePlugins, SimpleDataSourceAllButton} from "@enterprise_search/react_datasource_plugin";
import {DataPlugins} from "@enterprise_search/react_data/src/react.data";
import {SimpleSearchBar} from "@enterprise_search/search_bar";
import {simpleLoadingDisplay} from "@enterprise_search/loading";
import {SimpleDataSourceNavBarLayout} from "@enterprise_search/react_datasource_plugin/src/data.source.nav.bar";
import {SovereignStateProviderFromUseState} from "@enterprise_search/sovereign/src/sovereign.state.context";
import {SovereignSelectionState} from "@enterprise_search/sovereign";
import {IconProvider, simpleIconFn} from "@enterprise_search/icons";
import {dataSourceFilterName, simpleDataSourceFilter} from "@enterprise_search/react_data_sources_filter_plugin";

export type SearchAppFilters = TimeFilters & KeywordsFilter

export const exampleMsalConfig: Configuration = {
    auth: {
        clientId: process.env.REACT_MSAL_CLIENT_ID ?? "ec963ff8-b8c7-411e-80b1-9473d0390b3b",
        authority: `https://login.microsoftonline.com/b914a242-e718-443b-a47c-6b4c649d8c0a`,
        redirectUri: "/tile",
        postLogoutRedirectUri: "/",
    },
};
const msal = new PublicClientApplication(exampleMsalConfig);
const login: LoginConfig = loginUsingMsal({msal, debug: false});


const reactFiltersContextData: ReactFiltersContextData<any, any> = {
    plugins: {
        [keywordsFilterName]: simpleKeywordsFilterPlugin,
        [timefilterPluginName]: exampleTimeFilterPlugin,
        [dataSourceFilterName]: simpleDataSourceFilter

    },
    PurposeToFilterLayout: {
        [filtersDisplayPurpose]: ({children}) => <div><h3>Filters</h3>{children}</div>
    }
}
const dataSourcePlugins: DataSourcePlugins<any> = {
    // elasticSearch: elasticSearchDataSourcePlugin

}
const dataPlugins: DataPlugins = {}

const searchResultsPlugins: SearchResultsPlugins = {
    'start': ExampleInitialSearchResultsPlugin,
}

const allElasticSearchData = {type: 'elasticSearch', indicies: ['jira-prod', 'confluence-prod']}
const jiraElasicSearchData = {type: 'elasticSearch', indicies: ['jira-prod']}
const confluenceElasticSearchData = {type: 'elasticSearch', indicies: ['confluence-prod']}
const graphApiPeopleData = {type: 'graphApiPeople'}
const sharepointData = {type: 'sharepoint'}
const allDataSources = [allElasticSearchData, jiraElasicSearchData, confluenceElasticSearchData, graphApiPeopleData, sharepointData];
const someLayout = {
    start: {
        searchResult: 'start',
        visibleInNavBar: false,
        dataSources: allDataSources
    },
    all: {
        searchResult: 'all',
        dataSources: allDataSources
    },
    jira: {
        searchResult: 'oneDataSource',
        dataSources: [jiraElasicSearchData]
    },
    confluence: {
        searchResult: 'oneDataSource',
        dataSources: [confluenceElasticSearchData]
    },
    graphApiPeople: {
        searchResult: 'oneDataSource',
        dataSources: [graphApiPeopleData]
    },
    sharepoint: {
        searchResult: 'oneDataSource',
        dataSources: [sharepointData]
    }
}

const searchImportantComponents: SearchImportantComponents<any, any> = {
    SearchBar: SimpleSearchBar,
    searchResultsPlugins,
    dataSourcePlugins,
    dataPlugins,
    reactFiltersContextData,
    LoadingDisplay: simpleLoadingDisplay,
    displayLogin: SimpleDisplayLogin,
    NotLoggedIn: SimpleMustBeLoggedIn,
    DataSourceNavBarLayout: SimpleDataSourceNavBarLayout,
    DataSourceAllButton: SimpleDataSourceAllButton
}


const initialSelectionState: SovereignSelectionState<any> = {
    selected: 'start',
    state: {start: {}}
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

    return <Authenticate>
        <DisplayLogin/> {/* The headers go here */}
        <SearchResults/> {/* The main display */}
        {/* The footer goes here */}
    </Authenticate>
}


msal.initialize({}).then(() => {
//we set up here: how we display the components, how we do state management and how we do authentication
    root.render(<React.StrictMode>
            <SovereignStateProviderFromUseState state={initialSelectionState}>
                <SearchImportantComponentsProvider components={searchImportantComponents}>
                    <SearchInfoProviderUsingUseState allSearchState={emptySearchState}>
                        <AuthenticationProvider loginConfig={login}>
                            <IconProvider iconFn={simpleIconFn}>
                                <SearchApp initialPurpose='start'/>
                                <hr/>
                                <DebugSearchState/>
                            </IconProvider>
                        </AuthenticationProvider>
                    </SearchInfoProviderUsingUseState>
                </SearchImportantComponentsProvider>
            </SovereignStateProviderFromUseState>
        </React.StrictMode>
    );
})

