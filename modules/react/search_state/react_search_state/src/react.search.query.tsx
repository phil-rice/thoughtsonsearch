import React, {useCallback} from "react";
import {AllSearches, OneSearch, SearchState, SearchType} from "@enterprise_search/search_state";
import {GetterSetter} from "@enterprise_search/react_utils";
import {lensBuilder} from "@enterprise_search/optics";
import {makeGetterSetter} from "@enterprise_search/optics/src/lens.getter.setters";


export type SearchStateOps<Filters> = GetterSetter<SearchState<Filters>>
export type SearchQueryOps = GetterSetter<string>
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



type SearchStateUsingStateProviderProps<Filters> = {
    allSearchState: SearchState<Filters>
    children: React.ReactNode
}

const searchsL = lensBuilder<SearchState<any>>().focusOn('searches');
const searchQueryL = lensBuilder<SearchState<any>>().focusOn('searchQuery');

//Note that this is a very inefficient implementation, as it will re-render the entire app on every state change.
//We will probably use recoil for real. But this allows us to get started.
export const SearchInfoProviderUsingUseState = <Filters, >({allSearchState: initialSearchState, children}: SearchStateUsingStateProviderProps<Filters>) => {
    const [searchState, setSearchState] = React.useState<SearchState<Filters>>(initialSearchState);
    const searchStateOps: SearchStateOps<Filters> = [searchState, setSearchState]
    const searchQueryOps: SearchQueryOps = makeGetterSetter(searchState, setSearchState, searchQueryL)
    const allSearchInfoOps: AllSearchesOps<Filters> = makeGetterSetter(searchState, setSearchState, searchsL)

    const filtersAndResultOps: OneSearchOpsFn<Filters> = useCallback<OneSearchOpsFn<Filters>>(
        (t: SearchType): OneSearchOps<Filters> => makeGetterSetter(searchState, setSearchState, searchsL.focusOn(t)), [searchState, setSearchState]);

    const filtersOps: FiltersOpFn<Filters> = useCallback<FiltersOpFn<Filters>>(
        (t: SearchType): FiltersOps<Filters> =>
            makeGetterSetter(searchState, setSearchState, searchsL.focusOn(t).focusOn('filters')), [searchState, setSearchState]);

    const oneFilterOps: OneFilterOpsStateAndNameFn<Filters> = useCallback<OneFilterOpsStateAndNameFn<Filters>>(
        <FilterName extends keyof Filters>(st: SearchType, filterName: FilterName) =>
            makeGetterSetter(searchState, setSearchState, searchsL.focusOn(st).focusOn('filters').focusOn<FilterName>(filterName)), [searchState, setSearchState]);

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
    const [searchState] = useSearchState<Filters>()
    return <pre>{JSON.stringify(searchState, null, 2)}</pre>
}

