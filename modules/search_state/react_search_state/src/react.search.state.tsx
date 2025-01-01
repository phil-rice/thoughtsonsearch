import React, {useCallback} from "react";
import {AllSearches, OneSearch, SearchState, SearchType} from "@enterprise_search/search_state";
import {GetterSetter, makeGetterSetter, useThrowError} from "@enterprise_search/react_utils";
import {lensBuilder} from "@enterprise_search/optics";


export type SearchStateOps<Filters> = GetterSetter<SearchState<Filters>>
export type AllSearchesOps<Filters> = GetterSetter<AllSearches<Filters>>
export type OneSearchOpsFn<Filters> = (t: SearchType) => GetterSetter<OneSearch<Filters>>
export type OneSearchOps<Filters> = GetterSetter<OneSearch<Filters>>
export type FiltersOpFn<Filters> = (t: SearchType) => GetterSetter<Filters>
export type FiltersOps<Filters> = GetterSetter<Filters>
export type OneFilterOpsStateAndNameFn<Filters> = <FilterName extends keyof Filters> (t: SearchType, filterName: FilterName) => OneFilterOps<Filters, FilterName>
export type OneFilterOpsFn<Filters> = <FilterName extends keyof Filters> (filterName: FilterName) => OneFilterOps<Filters, FilterName>
export type OneFilterOps<Filters, FilterName extends keyof Filters> = GetterSetter<Filters[FilterName]>


export type SearchStateContextData<Filters> = {
    searchStateOps: SearchStateOps<Filters>
    allSearchInfoOps: AllSearchesOps<Filters>
    filtersAndResultOps: OneSearchOpsFn<Filters>
    filtersOps: FiltersOpFn<Filters>
    oneFilterOps: OneFilterOpsStateAndNameFn<Filters>
}


export const SearchStateContext = React.createContext<SearchStateContextData<any> | undefined>(undefined);

type SearchStateProviderProps<Filters> = {
    ops: SearchStateContextData<Filters>
    children: React.ReactNode
}

export const SearchStateProvider = <Filters, >({ops, children}: SearchStateProviderProps<Filters>) => {
    return <SearchStateContext.Provider value={ops}>{children}</SearchStateContext.Provider>;
}


type SearchStateUsingStateProviderProps<Filters> = {
    allSearchState: SearchState<Filters>
    children: React.ReactNode
}

const searchsL = lensBuilder<SearchState<any>>().focusOn('searches');

//Note that this is a very inefficient implementation, as it will re-render the entire app on every state change.
//We will probably use recoil for real. But this allows us to get started.
export const SearchInfoProviderUsingUseState = <Filters, >({allSearchState: initialSearchState, children}: SearchStateUsingStateProviderProps<Filters>) => {
    const [searchState, setSearchState] = React.useState<SearchState<Filters>>(initialSearchState);
    const searchStateOps: SearchStateOps<Filters> = [searchState, setSearchState]
    const allSearchInfoOps: AllSearchesOps<Filters> = makeGetterSetter(searchState, setSearchState, searchsL)

    const filtersAndResultOps: OneSearchOpsFn<Filters> = useCallback<OneSearchOpsFn<Filters>>(
        (t: SearchType): OneSearchOps<Filters> => makeGetterSetter(searchState, setSearchState, searchsL.focusOn(t)), [searchState, setSearchState]);

    const filtersOps: FiltersOpFn<Filters> = useCallback<FiltersOpFn<Filters>>(
        (t: SearchType): FiltersOps<Filters> =>
            makeGetterSetter(searchState, setSearchState, searchsL.focusOn(t).focusOn('filters')), [searchState, setSearchState]);

    const oneFilterOps: OneFilterOpsStateAndNameFn<Filters> = useCallback<OneFilterOpsStateAndNameFn<Filters>>(
        <FilterName extends keyof Filters>(st: SearchType, filterName: FilterName) =>
            makeGetterSetter(searchState, setSearchState, searchsL.focusOn(st).focusOn('filters').focusOn<FilterName>(filterName)), [searchState, setSearchState]);

    const contextData: SearchStateContextData<Filters> = {searchStateOps, allSearchInfoOps, filtersAndResultOps, filtersOps, oneFilterOps};
    return <SearchStateProvider ops={contextData}>{children}</SearchStateProvider>;
}

export function useSearchState<Filters>(): SearchStateOps<Filters> {
    const reportError = useThrowError()
    const context = React.useContext(SearchStateContext);
    if (context === undefined) return reportError('s/w', 'useSearchState must be used within a SearchStateProvider or SearchInfoProviderUsingUseState');
    else return context.searchStateOps!
}

export function useAllSearches<Filters>(): AllSearchesOps<Filters> {
    const reportError = useThrowError()
    const context = React.useContext(SearchStateContext);
    if (context === undefined) return reportError('s/w', 'useAllSearches must be used within a SearchStateProvider or SearchInfoProviderUsingUseState');
    else return context.allSearchInfoOps!
}

export function useSearchResultsByStateType<Filters>(st: SearchType): OneSearchOps<Filters> {
    const reportError = useThrowError()
    const context = React.useContext(SearchStateContext);
    if (context === undefined) return reportError('s/w', 'useSearchResultsByStateType must be used within a SearchStateProvider or SearchInfoProviderUsingUseState');
    else return context.filtersAndResultOps(st)!
}

export function useFiltersByStateType<Filters>(st: SearchType): FiltersOps<Filters> {
    const reportError = useThrowError()
    const context = React.useContext(SearchStateContext);
    if (context === undefined) return reportError('s/w', 'useFiltersByStateType must be used within a SearchStateProvider or SearchInfoProviderUsingUseState');
    else return context.filtersOps(st)!
}

export function useOneFilterBySearchType<Filter>(st: SearchType): OneFilterOpsStateAndNameFn<Filter> {
    const reportError = useThrowError()
    const context = React.useContext(SearchStateContext);

    if (context === undefined) return reportError('s/w', 'useOneFilterBySearchType must be used within a SearchStateProvider or SearchInfoProviderUsingUseState');
    else return context.oneFilterOps!
}

export type SearchTypeContextData<Filters> = {
    searchType: SearchType
    filtersAndResultOps: OneSearchOps<Filters>
    filtersOps: FiltersOps<Filters>
    oneFilterOps: OneFilterOpsFn<Filters>
}



