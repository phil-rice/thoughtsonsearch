//displays all the search results from the search
import {SearchResultsPlugin} from "./search.results.plugin";
import {useAllFilters} from "@enterprise_search/react_filters_plugin";
import React from "react";
import {useSearchBar} from "@enterprise_search/search_bar";
import {SearchTypeProvider} from "@enterprise_search/react_search_state";
import {DataSourceNavBar} from "@enterprise_search/react_datasource_plugin";

export const ExampleInitialSearchResults = (purpose: string) => () => {
    const {SearchBar} = useSearchBar()
    const {DisplayFilters} = useAllFilters()
    return <>
        <h1>First page: no results</h1>
        <SearchBar/>
        <DataSourceNavBar/>
        <SearchTypeProvider searchType='main'>
            <DisplayFilters/>
        </SearchTypeProvider>
    </>
};

export const ExampleInitialSearchResultsPlugin: SearchResultsPlugin = {
    plugin: 'search_results',
    type: 'example.initial',
    layout: ExampleInitialSearchResults
}