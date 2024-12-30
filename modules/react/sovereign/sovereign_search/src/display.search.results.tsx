import React, {createContext, ReactElement, ReactNode} from "react";
import {useDataPlugins} from "@enterprise_search/react_data/src/react.data";
import {useSearchResultsByStateType} from "@enterprise_search/react_search_state";
import {searchResultsToDataView, searchResultsToErrors, SearchType} from "@enterprise_search/search_state";
import {useThrowError} from "@enterprise_search/react_utils";
import {ErrorInDataSource} from "./search.results.components";

export type DisplaySearchResultsProps = {}
export type DisplaySearchResults = (props: DisplaySearchResultsProps) => ReactElement

export type DisplaySearchResultsLayoutProps = { children: ReactNode }
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
    return <SearchResultsContext.Provider value={{DisplaySearchResultsLayout}}>{children}</SearchResultsContext.Provider>
}

export type SearchResultsOps = {
    DisplaySearchResultsLayout: ({children}: { children: React.ReactNode }) => React.ReactElement
}

export function useSearchResultsLayout(): SearchResultsContextType {
    const context = React.useContext(SearchResultsContext)
    const reportError = useThrowError()
    if (!context) reportError('s/w', "useSearchResultsLayout must be used within a SearchResultsProvider")
    return context!
}

export type SearchResultsProps = {
    st?: SearchType
}


export const SearchResults = <Filters extends any>({st = 'main'}: SearchResultsProps) => {
    const {DisplaySearchResultsLayout} = useSearchResultsLayout()
    const dataPlugins = useDataPlugins()
    const reportError = useThrowError()
    const [oneSearch] = useSearchResultsByStateType<Filters>(st)
    const {dataSourceToSearchResult} = oneSearch
    const dataTypeToData = searchResultsToDataView(dataSourceToSearchResult)
    return <DisplaySearchResultsLayout>
        {Object.entries(dataTypeToData).map(([dataType, data]) => {
            const plugin = dataPlugins[dataType]
            if (!plugin) reportError('s/w', `No plugin found for data type ${dataType}. Legal values are ${Object.keys(dataPlugins).sort().join(', ')}`)
            return plugin.DefaultDisplayData({data})
        })}
        {Object.entries(searchResultsToErrors(dataSourceToSearchResult)).map(([dataSourceName, errors]) => {
            return <ErrorInDataSource key={dataSourceName} dataSourceName={dataSourceName} errors={errors}/>
        })}
    </DisplaySearchResultsLayout>
};

export function SimpleDisplayResultsLayout({children}: { children: React.ReactNode }) {
    return <div className='search.results'>{children}</div>
}