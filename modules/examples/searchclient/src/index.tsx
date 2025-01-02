import React from "react";
import {createRoot} from "react-dom/client";
import {Configuration, PublicClientApplication} from "@azure/msal-browser";
import {loginUsingMsal} from "@enterprise_search/msal_authentication";
import {authenticateDebug, LoginConfig, SimpleDisplayLogin, SimpleNotLoggedIn} from "@enterprise_search/react_login_component";
import {filtersDisplayPurpose, ReactFiltersContextData} from "@enterprise_search/react_filters_plugin";

import {SearchImportantComponents, SearchImportantComponentsProvider, startStateDebug} from "@enterprise_search/search_important_components";
import {CommonDataSourceDetails, DataSourceDetails, DataSourcePlugins, validateDataSourcePlugins} from "@enterprise_search/react_datasource_plugin";
import {DataPlugins} from "@enterprise_search/react_data/src/react.data";
import {SimpleSearchBar} from "@enterprise_search/search_bar";
import {SimpleSovereignAppComponents, SimpleUnknownDisplay, SovereignApp, SovereignStatePlugins} from "@enterprise_search/sovereign";
import {dataViewFilter, dataViewFilterName, DataViewFilters, SimpleDataViewFilterDisplay} from "@enterprise_search/react_data_views_filter_plugin";
import {AdvanceSearchPagePlugin, InitialSovereignPagePlugin, SimpleDisplayResultsLayout, simpleSearchResultComponents} from "@enterprise_search/sovereign_search";
import {KeywordsFilter, keywordsFilterName, simpleKeywordsFilterPlugin} from "@enterprise_search/react_keywords_filter_plugin";
import {DoTheSearching, searchDebug} from "@enterprise_search/search";
import {dataViewDebug, SimpleDataViewNavItem} from "@enterprise_search/data_views";
import {ElasticSearchContext, elasticSearchDataSourcePlugin, elasticSearchDsName, ElasticSearchSourceDetails} from "@enterprise_search/search_elastic";
import {consoleErrorReporter, FeatureFlags} from "@enterprise_search/react_utils";
import {routingDebug} from "@enterprise_search/routing";
import {simpleSearchDropDownComponents} from "@enterprise_search/search_dropdown";
import {basicAuthentication} from "@enterprise_search/authentication";
import {axiosServiceCaller} from "@enterprise_search/axios_service_caller";
import {exampleTimeFilterPlugin, timefilterPluginName, TimeFilters} from "@enterprise_search/react_time_filter_plugin";
import {ConfluenceDataName, ConfluenceDataPlugin} from "@enterprise_search/confluence_data_plugin";
import {JiraDataName, JiraDataPlugin} from "@enterprise_search/jira_data_plugin";
import {SimpleDataLayout} from "@enterprise_search/renderers";
import {PeopleDataName, peopleDataPlugin} from "@enterprise_search/people_data_plugin";
import {OneSearchPagePlugin} from "@enterprise_search/sovereign_search";
import {nowTimeService} from "@enterprise_search/recoil_utils";
import {SovereignAppProvider} from "@enterprise_search/sovereign";


const debugState = {
    [authenticateDebug]: false,
    [searchDebug]: false,
    [startStateDebug]: false,
    [dataViewDebug]: false,
    [routingDebug]: false,
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

export const elasticSearchContext: ElasticSearchContext = {
    timeService: nowTimeService,
    knownIndices: ['jira-prod', 'confluence-prod'],
    elasticSearchUrl: process.env['REACT_APP_ELASTIC_SEARCH_URL']!,
    serviceCaller: axiosServiceCaller,
    authentication: basicAuthentication(
        process.env['REACT_APP_ELASTIC_SEARCH_USERNAME']!,
        process.env['REACT_APP_ELASTIC_SEARCH_PASSWORD']!)
}


const dataSourcePlugins: DataSourcePlugins<any> = {
    elasticSearch: elasticSearchDataSourcePlugin(elasticSearchContext)
}
try {
    validateDataSourcePlugins(dataSourcePlugins)
} catch (e: any) {
    if (window.location.href.includes('ignoreValidation=true'))
        console.error(e)
    else throw e
}

const dataPlugins: DataPlugins = {
    [ConfluenceDataName]: ConfluenceDataPlugin(),
    [JiraDataName]: JiraDataPlugin(),
    [PeopleDataName]: peopleDataPlugin()
}

type AllDataSourceDetails = ElasticSearchSourceDetails | CommonDataSourceDetails

const allElasticSearchData: ElasticSearchSourceDetails = {type: elasticSearchDsName, names: ['jira-prod', 'confluence-prod']}
const jiraElasicSearchData: ElasticSearchSourceDetails = {type: elasticSearchDsName, names: ['jira-prod']}
const confluenceElasticSearchData: ElasticSearchSourceDetails = {type: elasticSearchDsName, names: ['confluence-prod']}
const graphApiPeopleData: CommonDataSourceDetails = {type: 'graphApiPeople', names: ['people']}
const sharepointData: CommonDataSourceDetails = {type: 'sharepoint', names: ['sharepoint']}
const allDetails: AllDataSourceDetails[] = [allElasticSearchData, graphApiPeopleData, sharepointData];
const dataViewDetails: DataSourceDetails<AllDataSourceDetails> = {
    all: {details: allDetails, displayAsWidget: true, expectedDataTypes: ['jira', 'confluence', 'people']},
    jira: {details: [jiraElasicSearchData], expectedDataTypes: ['jira']},
    confluence: {details: [confluenceElasticSearchData], expectedDataTypes: ['confluence']},
    graphApiPeople: {details: [graphApiPeopleData], expectedDataTypes: ['people']},
    sharepoint: {details: [sharepointData]}
}


const searchImportantComponents: SearchImportantComponents<any, AllDataSourceDetails, any> = {
    dataSourcePlugins,
    dataPlugins,
    reactFiltersContextData,
    DisplayLogin: SimpleDisplayLogin,
    NotLoggedIn: SimpleNotLoggedIn,
    SearchBar: SimpleSearchBar,
    DisplaySearchResultsLayout: SimpleDisplayResultsLayout,
    NavBarItem: SimpleDataViewNavItem,
    dataViewDetails,
    SearchResultsComponents: simpleSearchResultComponents,
    SearchDropDownComponents: simpleSearchDropDownComponents
}

const sovereignStatePlugins: SovereignStatePlugins = {
    plugins: {
        start: InitialSovereignPagePlugin,
        advancedSearch: AdvanceSearchPagePlugin,
        one: OneSearchPagePlugin,
    },
    UnknownDisplay: SimpleUnknownDisplay
}


const featureFlags: FeatureFlags = {
    flag1: {value: true, description: 'An example feature flag'},
    flag2: {value: false, description: 'Another feature flag'}
};

const root = createRoot(document.getElementById('root') as HTMLElement);

msal.initialize({}).then(() => {
//we set up here: how we display the components, how we do state management and how we do authentication

    root.render(<React.StrictMode>
            <SovereignAppProvider login={login}
                                  errorReporter={consoleErrorReporter}
                                  debugState={debugState}
                                  sovereignStatePlugins={sovereignStatePlugins}
                                  featureFlags={featureFlags}
                                  dataLayout={SimpleDataLayout}
                                  sovAppComponents={SimpleSovereignAppComponents}

            >
                <SearchImportantComponentsProvider components={searchImportantComponents}>
                    <DoTheSearching resultSize={20}>
                        <SovereignApp/>
                    </DoTheSearching>
                </SearchImportantComponentsProvider>
            </SovereignAppProvider>
        </React.StrictMode>
    );
})

