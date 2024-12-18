import {NameAnd} from "@enterprise_search/recoil_utils";
import React, {useMemo} from "react";

export type SearchResultsPlugin = {
    plugin: 'search_results'
    /* Each plugin has a type that should be unique. Currently used for logging/debugging purposes only. helps us understand as developers what is happening when we are in the debug screens */
    type: string
    /* The layout that should be used to display the search results */
    layout: (purpose: string) => SearchResultsLayout
}

export type SearchResultsLayoutProps = { purpose: string }
export type SearchResultsLayout = (props: SearchResultsLayoutProps) => React.ReactElement

/* Maps from the purpose of the search results to the plugin that should be used to display them
* Example purposes are 'all', 'oneDatasource'... Not done as a type because it is extensible, and a type would make it closed to extension */
export type SearchResultsPlugins = NameAnd<SearchResultsPlugin>

const SearchResultsPluginContext = React.createContext<SearchResultsPlugins | undefined>(undefined)

export function SearchResultsPluginProvider({children, plugins}: { children: React.ReactNode, plugins: SearchResultsPlugins }): React.ReactElement {
    return <SearchResultsPluginContext.Provider value={plugins}>{children}</SearchResultsPluginContext.Provider>
}

type SearchResultsOps = {
    SearchResults: SearchResultsLayout
}

/** Example usage
 *  const {SearchResults} = useSearchResults('all')
 *  return <SearchResults />
 */
export function useSearchResults(purpose: string): SearchResultsOps {
    const plugins = React.useContext(SearchResultsPluginContext)
    const SearchResults = useMemo(() => {
        if (!plugins) throw new Error('SearchResultsPluginProvider not found in the component tree')
        const searchResultsPlugin = plugins[purpose];
        const SearchResults = searchResultsPlugin.layout(purpose)
        return SearchResults
    }, [purpose, plugins])
    return {SearchResults}
}


