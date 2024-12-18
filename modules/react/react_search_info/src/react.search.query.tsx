import React, {useMemo} from "react";
import {SearchInfo, SearchQuery, SearchState} from "@enterprise_search/search_domain";
import {NameAnd} from "@enterprise_search/recoil_utils";


export type SearchInfoOps = {
    searchInfo: SearchInfo
    setSearchInfo: (searchInfo: SearchInfo) => void

    searchQuery: SearchQuery
    setSearchQuery: (searchQuery: SearchQuery) => void

    filters: NameAnd<any>

    searchFilter: <Filter>(filterName: string) => Filter
    setSearchFilter: (filterName: string) => <Filter>(filter: Filter) => void
}


export const SearchInfoContext = React.createContext<SearchInfoOps | undefined>(undefined);


type SearchInfoProviderProps = {
    ops: SearchInfoOps
    children: React.ReactNode
}

export const SearchInfoProvider = ({ops, children}: SearchInfoProviderProps) => {
    return (
        <SearchInfoContext.Provider value={ops}>{children}</SearchInfoContext.Provider>
    );
}

type SearchInfoUsingStateProviderProps = {
    searchInfo: SearchInfo
    children: React.ReactNode
}

export const SearchInfoProviderUsingUseState = ({searchInfo: initialSearchInfo, children}: SearchInfoUsingStateProviderProps) => {
    const [searchInfo, setSearchInfo] = React.useState<SearchInfo>(initialSearchInfo);

    const setSearchQuery = useMemo(() => (searchQuery: SearchQuery) => {
        setSearchInfo({...searchInfo, searchState: {...searchInfo.searchState, query: searchQuery}});
    }, [setSearchInfo]);

    const searchFilter = useMemo(() => <Filter extends any>(filterName: string) => {
        return searchInfo.searchState.query.filters[filterName] as Filter;
    }, [searchInfo]);
    const setSearchFilter = useMemo(() => (filterName: string) => <Filter extends any>(filter: Filter) => {
        const newFilters = {...searchInfo.searchState.query.filters, [filterName]: filter};
        const newQuery = {...searchInfo.searchState.query, filters: newFilters};
        const newSearchState = {...searchInfo.searchState, query: newQuery};
        setSearchInfo({...searchInfo, searchState: newSearchState});
    }, [setSearchInfo]);

    const ops: SearchInfoOps = {
        searchInfo, setSearchInfo: setSearchInfo,
        searchQuery: searchInfo.searchState.query, setSearchQuery,
        filters: searchInfo.searchState.query.filters,
        searchFilter,
        setSearchFilter
    };
    return <SearchInfoProvider ops={ops}>{children}</SearchInfoProvider>;
}

export function useSearchInfo(): SearchInfoOps {
    const context = React.useContext(SearchInfoContext);
    if (context === undefined) {
        throw new Error('useSearchInfo must be used within a SearchInfoProvider or SearchInfoProviderUsingUseState');
    }
    return context;
}

