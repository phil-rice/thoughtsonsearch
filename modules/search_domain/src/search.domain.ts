import {NameAnd} from "@laoban/utils";
import {ErrorsOr} from "@enterprise_search/errors";

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
export type SearchQuery = {
    //When we update the search query the count increases. This allows us to synchronise search results. if one slow one returns ... should we display it?
    count: number
    //The query string after it has gone through the parser. 'Praveen in people' would result in Praveen. Most strings result in themselves
    keywords: string
    //The time filter such as 'last 3 days'
    timeInfo: SearchTimeInfo
    //Which 'places'. Usually these only make sense within one data source. For example in confluence we would be searching just 'these spaces'
    spaces: string[]
    languages: string[]
}
export type QueryDatasourceAndPaging<Paging> = {
    query: SearchQuery
    datasourceName: string
    paging: Paging
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
