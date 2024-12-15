import {ErrorsOr} from "@enterprise_search/errors";
import {NameAnd} from "@enterprise_search/recoil_utils";

export type SearchState = {
    queryString: string
    datasourceNames: string[]
    query: SearchQuery
}
export type SearchInfo = {
    count: number
    searchState: SearchState
    searchResult: DatasourceToSearchResult
}

//The first name is the name of the aggregate. For examples spaces or projects
//Then we make the values to the count
export type Aggregates = NameAnd<NameAnd<number>>

//A lot of these will have to become filters. And we'll need to know which data sources care about which filter
//I think it's the filter count that matters not the count, as if a data source ignores the filter, the global count would mean a research
//The filter will be a NameAnd<something> where something is the filter. See the file filters.ts
//It's generic because we will want to be having lots of filters and be able to add more
//The name of the filter is important because the search type class has a list of filters it can handle and
//we use the name to work out how to process the filter.
//
export type SearchQuery = {
    //When we update the search query the count increases. This allows us to synchronise search results. if one slow one returns ... should we display it?
    count: number
    //The query string after it has gone through the parser. 'Praveen in people' would result in Praveen. Most strings result in themselves
    keywords: string
    //The name of the filter and the value. For example 'space' and ['me8', 'infra'] or 'time': 'last 3 hours'
    //Note that each of the type classes has a list of filters they accept, and they should ignore the others
    //I did explore making this stronger typed, but it damages the code base a lot and doesn't actually help I think
    filters: NameAnd<any>
}

export type QueryDatasourceAndPaging<Paging> = {
    query: SearchQuery
    datasourceName: string
    paging?: Paging // if not specified will be page 1
}

export type SinceTimeInfo = {
    from: Date
    to: Date
}
export type SearchTimeInfo = SinceTimeInfo

export type DatasourceToSearchResult = NameAnd<ErrorsOr<SearchResult<any, any>>>
export type DatasourceToPromiseSearchResult = NameAnd<Promise<ErrorsOr<SearchResult<any, any>>>>

export type SearchResult<Data, Paging> = {
    datasourceName: string
    count: number //the count of the query at the moment we launched the search
    aggregates?: Aggregates
    data: Data[]
    paging?: Paging // if undefined we haven't done any paging yet
}
