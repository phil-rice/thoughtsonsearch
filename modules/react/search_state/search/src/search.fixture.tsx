// a test fixture for things involving search

import {Errors} from "@enterprise_search/errors";
import {ErrorReporter, NonFunctionalsProvider} from "@enterprise_search/react_utils";
import React from "react";
import {CommonDataSourceDetails, DataSourceDetails, DataSourcePlugin, DataSourcePluginProvider, FetchFromDatasourceFn} from "@enterprise_search/react_datasource_plugin";
import {KeywordsFilter, keywordsFilterName} from "@enterprise_search/react_keywords_filter_plugin";
import {dataViewFilterName, DataViewFilters} from "@enterprise_search/react_data_views_filter_plugin";
import {timefilterPluginName, TimeFilters} from "@enterprise_search/react_time_filter_plugin";
import {SearchInfoProviderUsingUseState, useSearchState} from "@enterprise_search/react_search_state";
import {SearchState} from "@enterprise_search/search_state";
import {dataSourceDetailsToDataView, DataViews, DataViewsProvider, SimpleDataViewNavItem} from "@enterprise_search/data_views";
import {SimpleNavItem} from "@enterprise_search/navbar";
import {WindowUrlContext, WindowUrlData, WindowUrlProvider, WindowUrlProviderForTests} from "@enterprise_search/routing";
import {SovereignStateProvider} from "@enterprise_search/sovereign";
import {GuiSelectedDataViewProvider} from "@enterprise_search/search_gui_state";

export type TestFilters = KeywordsFilter & DataViewFilters & TimeFilters
export type TestPaging = {}

export function TestDataSourcePlugin(fetch: FetchFromDatasourceFn<TestFilters, TestPaging>): DataSourcePlugin<CommonDataSourceDetails, TestFilters, TestPaging> {
    return {
        plugin: 'datasource',
        datasourceName: 'test',
        validate: () => [],
        fetch
    }
}

const testJiraDs = 'testJiraDs'
const testConfluenceDs = 'testConfluenceDs'
const jiraElasicSearchData: CommonDataSourceDetails = {type: testJiraDs, names: ['jira-prod']}
const confluenceElasticSearchData: CommonDataSourceDetails = {type: testConfluenceDs, names: ['confluence-prod']}

const dataViewDetails: DataSourceDetails<CommonDataSourceDetails> = {
    all: {details: [jiraElasicSearchData, confluenceElasticSearchData], displayAsWidget: true, expectedDataTypes: ['jira', 'confluence', 'people']},
    jira: {details: [jiraElasicSearchData], expectedDataTypes: ['jira']},
    confluence: {details: [confluenceElasticSearchData], expectedDataTypes: ['confluence']},
}

export const jiraConflFiltersForTest: TestFilters = {
    [keywordsFilterName]: "test",
    [dataViewFilterName]: {allowedNames: ["jira", 'confluence'], selectedNames: ['jira', 'confluence'], selected: 'all'},
    [timefilterPluginName]: ''
};

export const testDataViews: DataViews<CommonDataSourceDetails> = dataSourceDetailsToDataView(dataViewDetails, SimpleDataViewNavItem)

export type ProviderForSearchProps = {
    fetch: FetchFromDatasourceFn<TestFilters, TestPaging>
    reportedErrors: Errors[]
    children: React.ReactNode;
    state: SearchState<TestFilters>
    dataViews: DataViews<CommonDataSourceDetails>
    url: string
}

export const TestSearchStateDisplay = () => {
    const [searchState] = useSearchState();
    return <pre aria-label="search-state">{JSON.stringify(searchState, null, 2)}</pre>;
};

export function ProviderForSearchTests({reportedErrors, children, state, dataViews, url, fetch}: ProviderForSearchProps) {

    const errorReporter: ErrorReporter = async e => {
        reportedErrors.push(e);
        return e
    };

    return <WindowUrlProviderForTests initialUrl={url}>
        <NonFunctionalsProvider errorReporter={errorReporter} debugState={{}} featureFlags={{}}>
            <SovereignStateProvider>
                <GuiSelectedDataViewProvider>
                    <DataSourcePluginProvider plugins={{test: TestDataSourcePlugin(fetch)}}>
                        <SearchInfoProviderUsingUseState allSearchState={state}>
                            <DataViewsProvider dataViews={dataViews}>
                                {children}
                            </DataViewsProvider>
                        </SearchInfoProviderUsingUseState>
                    </DataSourcePluginProvider>
                </GuiSelectedDataViewProvider>
            </SovereignStateProvider>
        </NonFunctionalsProvider>
    </WindowUrlProviderForTests>
}