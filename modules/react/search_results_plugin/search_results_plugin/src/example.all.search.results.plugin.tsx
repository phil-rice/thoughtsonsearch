import React from "react";
import {SearchResultsPlugin} from "./search.results.plugin";
import {useAllFilters} from "@enterprise_search/react_filters_plugin";
import {useSearchBar} from "@enterprise_search/search_bar";



export const ExampleAllSearchResults = (purpose: string) => () => {
    const {SearchBar} = useSearchBar()
    const {DisplayFilters} = useAllFilters(purpose)

    return <>
        <h1>All results</h1>
        <SearchBar/>
        <DisplayFilters/>
    </>
}
export const ExampleAllSearchResultsPlugin: SearchResultsPlugin = {
    plugin: 'search_results',
    type: 'example.all',
    layout: ExampleAllSearchResults
}