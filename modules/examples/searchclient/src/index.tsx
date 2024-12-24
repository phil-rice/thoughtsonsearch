import React, {useEffect} from "react";
import {createRoot} from "react-dom/client";
import {Configuration, PublicClientApplication} from "@azure/msal-browser";
import {Authenticate, AuthenticationProvider, LoginConfig} from "@enterprise_search/authentication";
import {loginUsingMsal} from "@enterprise_search/msal_authentication";
import {SimpleDisplayLogin, SimpleMustBeLoggedIn, useLoginComponents} from "@enterprise_search/react_login_component";
import {emptySearchState} from "@enterprise_search/search_state";
import {filtersDisplayPurpose, ReactFiltersContextData} from "@enterprise_search/react_filters_plugin";
import {exampleTimeFilterPlugin, timefilterPluginName, TimeFilters} from "@enterprise_search/react_time_filter_plugin";
import {DebugSearchState, SearchInfoProviderUsingUseState} from "@enterprise_search/react_search_state";
import {SearchImportantComponents, SearchImportantComponentsProvider} from "@enterprise_search/search_important_components";
import {DataSourcePlugins} from "@enterprise_search/react_datasource_plugin";
import {DataPlugins} from "@enterprise_search/react_data/src/react.data";
import {SimpleSearchBar} from "@enterprise_search/search_bar";
import {simpleLoadingDisplay} from "@enterprise_search/loading";
import {DisplaySelectedSovereignPage, SovereignStatePlugins, SovereignStatePluginsProvider, SovereignStateProvider} from "@enterprise_search/sovereign";
import {IconProvider, simpleIconContext} from "@enterprise_search/icons";
import {dataViewFilter, dataViewFilterName, DataViewFilters, SimpleDataViewFilterDisplay} from "@enterprise_search/react_data_views_filter_plugin";
import {AdvanceSearchPagePlugin, InitialSovereignPagePlugin, SimpleDisplayResultsLayout} from "@enterprise_search/sovereign_search";
import {KeywordsFilter, keywordsFilterName, simpleKeywordsFilterPlugin} from "@enterprise_search/react_keywords_filter_plugin";
import {emptySearchGuiState, SearchGuiStateProvider} from "@enterprise_search/search_gui_state";
import {DoTheSearching} from "@enterprise_search/search/src/search";


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


export type SearchAppFilters = TimeFilters & KeywordsFilter & DataViewFilters
const reactFiltersContextData: ReactFiltersContextData<SearchAppFilters> = {
    plugins: {
        [keywordsFilterName]: simpleKeywordsFilterPlugin,
        [timefilterPluginName]: exampleTimeFilterPlugin,
        [dataViewFilterName]: dataViewFilter<SearchAppFilters>(SimpleDataViewFilterDisplay)
    },
    PurposeToFilterLayout: {
        [filtersDisplayPurpose]: ({children}) => <div><h3>Filters</h3>{children}</div>
    }
}
const dataSourcePlugins: DataSourcePlugins<any> = {
    // elasticSearch: elasticSearchDataSourcePlugin

}
const dataPlugins: DataPlugins = {}


const allElasticSearchData = {type: 'elasticSearch', indicies: ['jira-prod', 'confluence-prod']}
const jiraElasicSearchData = {type: 'elasticSearch', indicies: ['jira-prod']}
const confluenceElasticSearchData = {type: 'elasticSearch', indicies: ['confluence-prod']}
const graphApiPeopleData = {type: 'graphApiPeople'}
const sharepointData = {type: 'sharepoint'}
const allDataSources = [allElasticSearchData, jiraElasicSearchData, confluenceElasticSearchData, graphApiPeopleData, sharepointData];

const someLayout = {
    start: {
        searchResult: 'start',
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
    dataSourcePlugins,
    dataPlugins,
    reactFiltersContextData,
    LoadingDisplay: simpleLoadingDisplay,
    DisplayLogin: SimpleDisplayLogin,
    NotLoggedIn: SimpleMustBeLoggedIn,
    SearchBar: SimpleSearchBar,
    DisplaySearchResultsLayout: SimpleDisplayResultsLayout
}

const sovereignStatePlugins: SovereignStatePlugins = {
    start: InitialSovereignPagePlugin,
    advancedSearch: AdvanceSearchPagePlugin
}


const root = createRoot(document.getElementById('root') as HTMLElement);


type SearchAppProps = {}


function SearchApp({}: SearchAppProps) {
    const {DisplayLogin} = useLoginComponents()
    useEffect(() => document.querySelector("input")?.focus(), []); // Focus on the first input

    return <Authenticate>
        <DisplayLogin/> {/* The headers go here */}
        <DisplaySelectedSovereignPage/>
        {/* The footer goes here */}
    </Authenticate>
}


msal.initialize({}).then(() => {
//we set up here: how we display the components, how we do state management and how we do authentication
    root.render(<React.StrictMode>
            <SovereignStatePluginsProvider plugins={sovereignStatePlugins}>
                <SovereignStateProvider initial='start'>
                    <SearchImportantComponentsProvider components={searchImportantComponents}>
                        <SearchInfoProviderUsingUseState allSearchState={emptySearchState}>
                            <AuthenticationProvider loginConfig={login}>
                                <SearchGuiStateProvider searchGuiState={emptySearchGuiState}>
                                    <IconProvider icons={simpleIconContext}>
                                        <DoTheSearching>
                                            <SearchApp/>
                                            <hr/>
                                            <DebugSearchState/>
                                        </DoTheSearching>
                                    </IconProvider>
                                </SearchGuiStateProvider>
                            </AuthenticationProvider>
                        </SearchInfoProviderUsingUseState>
                    </SearchImportantComponentsProvider>
                </SovereignStateProvider>
            </SovereignStatePluginsProvider>
        </React.StrictMode>
    );
})

