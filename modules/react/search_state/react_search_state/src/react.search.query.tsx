import React, {Dispatch, SetStateAction, useCallback} from "react";
import {AllSearches, OneSearch, SearchState, SearchType} from "@enterprise_search/search_state";
import {Setter} from "../../../react_utils";
import {identityLens} from "@enterprise_search/optics/src/lens";


export type SearchStateOps<Filters> = {
    searchState: SearchState<Filters>
    setSearchState: Setter<SearchState<Filters>>
}

export type SearchQueryOps = {
    searchQuery: string
    setSearchQuery: Setter<string>
}
export type AllSearchesOps<Filters> = {
    allSearches: AllSearches<Filters>
    setAllSearches: Setter<AllSearches<Filters>>
}

export type OneSearchOpsFn<Filters> = (t: SearchType) => OneSearchOps<Filters>
export type OneSearchOps<Filters> = {
    filtersAndResult: OneSearch<Filters>
    setFiltersAndResult: Setter<OneSearch<Filters>>
}

export type FiltersOpFn<Filters> = (t: SearchType) => FiltersOps<Filters>
export type FiltersOps<Filters> = {
    filters: Filters
    setFilters: Setter<Filters>
}
export type OneFilterOpsStateAndNameFn<Filters> = <FilterName extends keyof Filters> (t: SearchType, filterName: FilterName) => OneFilterOps<Filters, FilterName>
export type OneFilterOpsFn<Filters> = <FilterName extends keyof Filters> (filterName: FilterName) => OneFilterOps<Filters, FilterName>
export type OneFilterOps<Filters, FilterName extends keyof Filters> = {
    filterName: FilterName
    filter: Filters[FilterName]
    setFilter: Setter<Filters[FilterName]>
}


export type SearchStateContextData<Filters> = {
    searchStateOps: SearchStateOps<Filters>
    searchQueryOps: SearchQueryOps
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

type SearchStateUsingStateProvider<Filters> = {
    allSearchState: SearchState<Filters>
    children: React.ReactNode
}

//Note that this is a very inefficient implementation, as it will re-render the entire app on every state change.
//We will probably use recoil for real. But this allows us to get started.
export const SearchInfoProviderUsingUseState = <Filters, >({allSearchState: initialSearchState, children}: SearchStateUsingStateProvider<Filters>) => {
    const [searchState, setSearchState] = React.useState<SearchState<Filters>>(initialSearchState);
    const x = setSearchState
    const searchStateOps: SearchStateOps<Filters> = {searchState, setSearchState}
    const searchQueryOps: SearchQueryOps = {
        searchQuery: searchState.searchQuery,
        setSearchQuery: (searchQuery: string) => setSearchState({...searchState, searchQuery})
    }
    const allSearchInfoOps: AllSearchesOps<Filters> = {
        allSearches: searchState.searches,
        setAllSearches: (allSearchInfo: AllSearches<Filters>) => setSearchState({...searchState, searches: allSearchInfo})
    };

    const filtersAndResultOps: OneSearchOpsFn<Filters> = useCallback<OneSearchOpsFn<Filters>>(
        (t: SearchType): OneSearchOps<Filters> => {
            return {
                filtersAndResult: searchState.searches[t],
                setFiltersAndResult: (filtersAndResult: OneSearch<Filters>) => setSearchState({
                    ...searchState,
                    searches: {...searchState.searches, [t]: filtersAndResult}
                })
            }
        }, [searchState, setSearchState]);

    const filtersOps: FiltersOpFn<Filters> = useCallback<FiltersOpFn<Filters>>(
        (t: SearchType): FiltersOps<Filters> => {
            return {
                filters: searchState.searches[t].filters,
                setFilters: (filters: Filters) => setSearchState({
                    ...searchState,
                    searches: {
                        ...searchState.searches,
                        [t]: {...searchState.searches[t], filters}
                    }
                })
            }
        }, [searchState, setSearchState]);
    const oneFilterOps: OneFilterOpsStateAndNameFn<Filters> = useCallback<OneFilterOpsStateAndNameFn<Filters>>(
        <FilterName extends keyof Filters>(st: SearchType, filterName: FilterName) => {
            const filterL = identityLens().focusOn('searchState').focusOn('searches').focusOn('searchType').focusOn('filters')
            return {
                filterName,
                filter: searchState.searches[st].filters[filterName],
                setFilter: (filter: Filters[keyof Filters]) => setSearchState(filterL.set({
                    ...searchState,
                    searches: {
                        ...searchState.searches,
                        [st]: {
                            ...searchState.searches[st],
                            filters: {...searchState.searches[st].filters, [filterName]: filter}
                        }
                    }
                })
            }
        }, [searchState, setSearchState]);

    const contextData: SearchStateContextData<Filters> = {searchStateOps, searchQueryOps, allSearchInfoOps, filtersAndResultOps, filtersOps, oneFilterOps};
    return <SearchStateProvider ops={contextData}>{children}</SearchStateProvider>;
}

export function useSearchState<Filters>(): SearchStateOps<Filters> {
    const context = React.useContext(SearchStateContext);
    if (context === undefined) throw new Error('useSearchState must be used within a SearchStateProvider or SearchInfoProviderUsingUseState');
    return context.searchStateOps
}

export function useSearchQuery(): SearchQueryOps {
    const context = React.useContext(SearchStateContext);
    if (context === undefined) throw new Error('useSearchQuery must be used within a SearchStateProvider or SearchInfoProviderUsingUseState');
    return context.searchQueryOps
}

export function useAllSearches<Filters>(): AllSearchesOps<Filters> {
    const context = React.useContext(SearchStateContext);
    if (context === undefined) throw new Error('useAllSearchInfo must be used within a SearchStateProvider or SearchInfoProviderUsingUseState');
    return context.allSearchInfoOps
}

export function useFiltersByStateType<Filters>(st: SearchType): FiltersOps<Filters> {
    const context = React.useContext(SearchStateContext);
    if (context === undefined) throw new Error('useOneFiltersByStateType must be used within a SearchStateProvider or SearchInfoProviderUsingUseState');
    return context.filtersOps(st)
}

export function useOneFilterBySearchType<Filter>(st: SearchType): OneFilterOpsStateAndNameFn<Filter> {
    const context = React.useContext(SearchStateContext);
    if (context === undefined) throw new Error('useOneFilterBySearchType must be used within a SearchStateProvider or SearchInfoProviderUsingUseState');
    return context.oneFilterOps
}

export type SearchTypeContextData<Filters> = {
    searchType: SearchType
    filtersAndResultOps: OneSearchOps<Filters>
    filtersOps: FiltersOps<Filters>
    oneFilterOps: OneFilterOpsFn<Filters>
}

export const SearchTypeContext = React.createContext<SearchTypeContextData<any> | undefined>(undefined);
export type SearchTypeProviderProps<Filters> = {
    searchType: SearchType
    children: React.ReactNode
}

export function SearchTypeProvider<Filters>({searchType, children}: SearchTypeProviderProps<Filters>) {
    const ops = React.useContext(SearchStateContext);
    if (ops === undefined) throw new Error('SearchTypeProvider must be used within a SearchStateProvider or SearchInfoProviderUsingUseState');
    const filtersAndResultOps = ops.filtersAndResultOps(searchType)
    const filtersOps = ops.filtersOps(searchType)
    const oneFilterOps: OneFilterOpsFn<Filters> = filterName => ops.oneFilterOps(searchType, filterName)
    const contextData: SearchTypeContextData<Filters> = {searchType, filtersAndResultOps, filtersOps, oneFilterOps}
    return <SearchTypeContext.Provider value={contextData}>{children}</SearchTypeContext.Provider>;
}

export function useFiltersAndResults<Filters>(): OneSearchOps<Filters> {
    const context = React.useContext(SearchTypeContext);
    if (context === undefined) throw new Error('useSearchInfo must be used within a SearchTypeProvider to focus it on a particular search type');
    return context.filtersAndResultOps;
}

export function useFilters<Filters>(): FiltersOps<Filters> {
    const context = React.useContext(SearchTypeContext);
    if (context === undefined) throw new Error('useSearchQuery must be used within a SearchTypeProvider to focus it on a particular search type');
    return context.filtersOps
}

export function useOneFilter<Filters, FilterName extends keyof Filters>(filter: FilterName): OneFilterOps<Filters, FilterName> {
    const context = React.useContext(SearchTypeContext)
    if (context === undefined) throw new Error('useOneFilter must be used within a SearchTypeProvider to focus it on a particular search type')
    return context.oneFilterOps(filter)
}

export function DebugSearchState<Filters, >() {
    const {searchState} = useSearchState<Filters>()
    return <pre>{JSON.stringify(searchState, null, 2)}</pre>
}

