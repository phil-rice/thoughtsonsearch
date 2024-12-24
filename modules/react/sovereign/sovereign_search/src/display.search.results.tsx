import React, {createContext, ReactElement, ReactNode} from "react";
import {useDataPlugins} from "@enterprise_search/react_data/src/react.data";
import {useSearchResultsByStateType} from "@enterprise_search/react_search_state";
import {DatasourceToSearchResult, SearchType} from "@enterprise_search/search_state";
import {NameAnd} from "@enterprise_search/recoil_utils";
import {isValue} from "@enterprise_search/errors";

export type DisplaySearchResultsProps = {}
export type DisplaySearchResults = (props: DisplaySearchResultsProps) => ReactElement

export type DisplaySearchResultsLayoutProps = {children: ReactNode}
export type DisplaySearchResultsLayout = (props: DisplaySearchResultsLayoutProps) => ReactElement

export type SearchResultsContextType = {
    DisplaySearchResultsLayout: DisplaySearchResultsLayout
}

export const SearchResultsContext = createContext<SearchResultsContextType | undefined>(undefined)

export type SearchResultsProviderProps = {
    children: React.ReactNode
    DisplaySearchResultsLayout: DisplaySearchResultsLayout
}

export function SearchResultsProvider({children, DisplaySearchResultsLayout}: SearchResultsProviderProps) {
    if (DisplaySearchResultsLayout === undefined) throw new Error("DisplaySearchResultsLayout is required")
    return <SearchResultsContext.Provider value={{DisplaySearchResultsLayout}}>{children}</SearchResultsContext.Provider>
}

export type SearchResultsOps = {
    DisplaySearchResultsLayout: ({children}: { children: React.ReactNode }) => React.ReactElement
}

export function useSearchResultsLayout(): SearchResultsOps {
    const context = React.useContext(SearchResultsContext)
    if (!context) throw new Error("useSearchResultsLayout must be used within a SearchResultsProvider")
    return context
}

export type SearchResultsProps = {
    st?: SearchType
}

/* Converts the results of a data search into a map of 'data type name' to the data */
export function searchResultsToDataView(dataSourceToSearchResult: DatasourceToSearchResult): NameAnd<any[]> {
    if (dataSourceToSearchResult === undefined) return {}
    const dataPlugins = useDataPlugins()
    const result: NameAnd<any[]> = {}
    Object.entries(dataSourceToSearchResult).map(([dataSourceName, searchResult]) => {
        if (isValue(searchResult)) {
            for (const item of (searchResult.value.data as any[])) {
                const dataType = item.type
                const plugin = dataPlugins[dataType]
                if (!plugin) throw new Error(`No plugin found for data type ${dataType}. Legal values are ${Object.keys(dataPlugins).sort().join(', ')}`)
                result[dataType] = result[dataType] || []
                result[dataType].push(item)
            }
        }
    })
    return result
}

export function SearchResults<Filters>({st = 'main'}: SearchResultsProps) {
    const {DisplaySearchResultsLayout} = useSearchResultsLayout()
    const dataPlugins = useDataPlugins()
    const [oneSearch] = useSearchResultsByStateType<Filters>(st)
    const {dataSourceToSearchResult} = oneSearch
    const dataTypeToData = searchResultsToDataView(dataSourceToSearchResult)
    return <DisplaySearchResultsLayout>
        {Object.entries(dataTypeToData).map(([dataType, data]) => {
            const plugin = dataPlugins[dataType]
            if (!plugin) throw new Error(`No plugin found for data type ${dataType}. Legal values are ${Object.keys(dataPlugins).sort().join(', ')}`)
            return plugin.DefaultDisplayData({data})
        })}
    </DisplaySearchResultsLayout>
}

export function SimpleDisplayResultsLayout({children}: { children: React.ReactNode }) {
    return <div className='search.results'>{children}</div>
}