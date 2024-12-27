import React, {useEffect} from "react";
import {createRoot} from "react-dom/client";
import {Configuration, PublicClientApplication} from "@azure/msal-browser";
import {authenticateDebug, AuthenticationProvider, bearerAuthentication, LoginConfig} from "@enterprise_search/authentication";
import {loginUsingMsal} from "@enterprise_search/msal_authentication";
import {Authenticate, SimpleDisplayLogin, SimpleMustBeLoggedIn, useLoginComponents} from "@enterprise_search/react_login_component";
import {filtersDisplayPurpose, ReactFiltersContextData} from "@enterprise_search/react_filters_plugin";
import {exampleTimeFilterPlugin, timefilterPluginName, TimeFilters} from "@enterprise_search/react_time_filter_plugin";
import {SearchImportantComponents, SearchImportantComponentsProvider, startStateDebug} from "@enterprise_search/search_important_components";
import {CommonDataSourceDetails, DataSourceDetails, DataSourcePlugins} from "@enterprise_search/react_datasource_plugin";
import {DataPlugins} from "@enterprise_search/react_data/src/react.data";
import {SimpleSearchBar} from "@enterprise_search/search_bar";
import {simpleLoadingDisplay} from "@enterprise_search/loading";
import {DisplaySelectedSovereignPage, SovereignStatePlugins, SovereignStateProvider} from "@enterprise_search/sovereign";
import {IconProvider, simpleIconContext} from "@enterprise_search/icons";
import {dataViewFilter, dataViewFilterName, DataViewFilters, SimpleDataViewFilterDisplay} from "@enterprise_search/react_data_views_filter_plugin";
import {AdvanceSearchPagePlugin, InitialSovereignPagePlugin, SimpleDisplayResultsLayout, simpleSearchResultComponents} from "@enterprise_search/sovereign_search";
import {KeywordsFilter, keywordsFilterName, simpleKeywordsFilterPlugin} from "@enterprise_search/react_keywords_filter_plugin";
import {DoTheSearching, searchDebug} from "@enterprise_search/search/src/search";
import {SimpleDataViewNavbarLayout, SimpleDataViewNavItem} from "@enterprise_search/data_views";
import {elasticSearchDataSourcePlugin, elasticSearchDsName, ElasticSearchSourceDetails} from "@enterprise_search/search_elastic";
import {consoleErrorReporter, FeatureFlags, NonFunctionalsProvider} from "@enterprise_search/react_utils";


const debugState = {
    [authenticateDebug]: false,
    [searchDebug]: false,
    [startStateDebug]: true
};

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


export type SearchAppFilters = KeywordsFilter & DataViewFilters & TimeFilters
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
    elasticSearch: elasticSearchDataSourcePlugin(bearerAuthentication(''))

}
const dataPlugins: DataPlugins = {}

type AllDataSourceDetails = ElasticSearchSourceDetails | CommonDataSourceDetails

const allElasticSearchData: ElasticSearchSourceDetails = {type: elasticSearchDsName, names: ['jira-prod', 'confluence-prod']}
const jiraElasicSearchData: ElasticSearchSourceDetails = {type: elasticSearchDsName, names: ['jira-prod']}
const confluenceElasticSearchData: ElasticSearchSourceDetails = {type: elasticSearchDsName, names: ['confluence-prod']}
const graphApiPeopleData: CommonDataSourceDetails = {type: 'graphApiPeople', names: ['people']}
const sharepointData: CommonDataSourceDetails = {type: 'sharepoint', names: ['sharepoint']}
const allDetails: AllDataSourceDetails[] = [allElasticSearchData, graphApiPeopleData, sharepointData];
const dataViewDetails: DataSourceDetails<AllDataSourceDetails> = {
    all: allDetails,
    jira: [jiraElasicSearchData],
    confluence: [confluenceElasticSearchData],
    graphApiPeople: [graphApiPeopleData],
    sharepoint: [sharepointData]
}


const searchImportantComponents: SearchImportantComponents<any, AllDataSourceDetails, any> = {
    dataSourcePlugins,
    dataPlugins,
    reactFiltersContextData,
    LoadingDisplay: simpleLoadingDisplay,
    DisplayLogin: SimpleDisplayLogin,
    NotLoggedIn: SimpleMustBeLoggedIn,
    SearchBar: SimpleSearchBar,
    DisplaySearchResultsLayout: SimpleDisplayResultsLayout,
    DataViewNavBarLayout: SimpleDataViewNavbarLayout,
    NavBarItem: SimpleDataViewNavItem,
    dataViewDetails,
    SearchResultsComponents: simpleSearchResultComponents
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


const featureFlags: FeatureFlags = {
    flag1: {value: true, description: 'An example feature flag'},
    flag2: {value: false, description: 'Another feature flag'}
};




msal.initialize({}).then(() => {
//we set up here: how we display the components, how we do state management and how we do authentication
    root.render(<React.StrictMode>
            <NonFunctionalsProvider debugState={debugState} featureFlags={featureFlags} errorReporter={consoleErrorReporter}>
                <AuthenticationProvider loginConfig={login}>
                    <SearchImportantComponentsProvider components={searchImportantComponents}>
                        <SovereignStateProvider initial='start' plugins={sovereignStatePlugins}>
                            <IconProvider icons={simpleIconContext}>
                                <DoTheSearching>
                                    <SearchApp/>
                                </DoTheSearching>
                            </IconProvider>
                        </SovereignStateProvider>
                    </SearchImportantComponentsProvider>
                </AuthenticationProvider>
            </NonFunctionalsProvider>
        </React.StrictMode>
    );
})

