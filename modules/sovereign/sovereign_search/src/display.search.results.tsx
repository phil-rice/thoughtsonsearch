import React, {createContext, ReactElement, ReactNode} from "react";
import {useDataPlugins} from "@enterprise_search/react_data";
import {useSearchResultsByStateType} from "@enterprise_search/react_search_state";
import {DataAndDataSource, searchResultsToDataAndDataSource, searchResultsToErrors, SearchType} from "@enterprise_search/search_state";
import {useThrowError} from "@enterprise_search/react_utils";
import {ErrorInDataSource, SimpleErrorInDataSource} from "./search.results.components";
import {useGuiSelectedDataView} from "@enterprise_search/search_gui_state";
import {useDataViews} from "@enterprise_search/data_views";

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
    st?: SearchType;
    showEvenIfEmpty?: boolean;
    DisplaySearchResultDataType?: DisplaySearchResultDataType
    ErrorInDataSource?: ErrorInDataSource
};

export type DisplaySearchResultDataTypeProps<Data, > = { dataType: string, data: DataAndDataSource<Data>[], displayAsWidget: boolean }
export type DisplaySearchResultDataType = <Data, >(props: DisplaySearchResultDataTypeProps<Data>) => ReactElement

export const DefaultDisplaySearchResultDataType: DisplaySearchResultDataType = <Data extends any>({data, displayAsWidget, dataType}: DisplaySearchResultDataTypeProps<Data>) => {
    const dataPlugins = useDataPlugins();
    const reportError = useThrowError();
    const plugin = dataPlugins[dataType];
    if (!plugin) reportError('s/w', `No plugin found for data type ${dataType}. Legal values are ${Object.keys(dataPlugins).sort().join(', ')}`);

    const {DisplayData, DisplayDataArray, DisplayDataWidget} = plugin
    return displayAsWidget
        ? <DisplayDataWidget title={dataType} id={`data-${dataType}`} data={data}/>
        : <DisplayDataArray title={dataType} id={`data-${dataType}`} data={data} Display={DisplayData}/>

};


export const SearchResults = <Filters extends any>({
                                                                             st = 'main',
                                                                             showEvenIfEmpty = true,
                                                                             DisplaySearchResultDataType = DefaultDisplaySearchResultDataType,
                                                                             ErrorInDataSource = SimpleErrorInDataSource
                                                                         }: SearchResultsProps) => {
    const {DisplaySearchResultsLayout} = useSearchResultsLayout();
    const [oneSearch] = useSearchResultsByStateType<Filters>(st);
    const {dataSourceToSearchResult} = oneSearch;
    const [dataViewName] = useGuiSelectedDataView()
    const dataViews = useDataViews()
    const dataView = dataViews[dataViewName]
    const throwError = useThrowError()
    if (!dataView) throwError('s/w', `No data view found for ${dataViewName}`)
    const dataTypeToData = searchResultsToDataAndDataSource(dataSourceToSearchResult);
    const errors = searchResultsToErrors(dataSourceToSearchResult);
    const names = showEvenIfEmpty ? dataView.expectedDataTypes || Object.keys(dataTypeToData) : Object.keys(dataTypeToData)
    return (
        <DisplaySearchResultsLayout>
            {names.map((dataType) => {
                const data = dataTypeToData[dataType] || []
                return <DisplaySearchResultDataType key={dataType} data={data} dataType={dataType} displayAsWidget={dataView.displayAsWidget}/>
            })}
            {Object.entries(errors).map(([dataSourceName, errors]) => {
                return <ErrorInDataSource key={dataSourceName} dataSourceName={dataSourceName} errors={errors}/>
            })}
        </DisplaySearchResultsLayout>
    );
};
