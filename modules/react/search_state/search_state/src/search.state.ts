import {ErrorsOr} from "@enterprise_search/errors";
import {NameAnd} from "@enterprise_search/recoil_utils";

export type SearchType = 'main' | 'immediate'

//Filters will be NameAnd<... something...> in practice
//The name of the filter and the value. For example 'space' and ['me8', 'infra'] or 'time': 'last 3 hours'
//Note that each of the type classes has a list of filters they accept, and they should ignore the others
//ALso note that the keywords are just a filtera
//I did explore making this stronger typed, but it damages the code base a lot and doesn't actually help I think
//Having it as a Filters is a good compromise
//Note that the type of Filters is only finally known in the program that ties all this together

export type AllSearches<Filters> = Record<SearchType, OneSearch<Filters>>

export type SearchState<Filters> = {
    searchQuery: string
    /** We can have many of these going on at once
     * Importantly there is the 'main' which happens when you press enter, and the 'intermediate' which is while you are typing.
     * I am sure there will be others     *
     * If the data changes the search happens (although there might be a debounce delay)*/
    searches: AllSearches<Filters>
}
export type OneSearch<Filters> = {
    //This is to prevent race conditions. We only use the result if the count hasn't changed
    count: number
    filters: Filters
    searchResult: DatasourceToSearchResult
}

export const emptyOneSearch: OneSearch<any> = {
    count: 0,
    filters: {},
    searchResult: {}
}
export const emptySearchState: SearchState<any> = {
    searchQuery: '',
    searches: {
        main: emptyOneSearch,
        immediate: emptyOneSearch
    }
}

//The first name is the name of the aggregate. For examples spaces or projects
//Then we make the values to the count
export type Aggregates = NameAnd<NameAnd<number>>


export type QueryDatasourceAndPaging<Filters, Paging> = {
    query: Filters
    datasourceName: string
    paging?: Paging // if not specified will be page 1
}

export type DatasourceToSearchResult = NameAnd<ErrorsOr<SearchResult<any, any>>>
export type DatasourceToPromiseSearchResult = NameAnd<Promise<ErrorsOr<SearchResult<any, any>>>>

export type SearchResult<Data, Paging> = {
    datasourceName: string
    count: number //the count of the query at the moment we launched the search
    aggregates?: Aggregates
    data: Data[]
    paging?: Paging // if undefined we haven't done any paging yet
}
