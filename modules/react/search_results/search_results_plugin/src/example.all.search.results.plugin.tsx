import React from "react";
import {SearchResultsPlugin} from "./search.results.plugin";


//displays all the search results from the search
export const ExampleAllSearchResults = (purpose: string) => () => {
    return <>
        <h1>Example all Search Results </h1></>;
};

export const ExampleAllSearchResultsPlugin: SearchResultsPlugin = {
    plugin: 'search_results',
    type: 'example.all',
    layout: ExampleAllSearchResults
}