import {SearchContext} from "./search.context";
import {DatasourceToPromiseSearchResult, DatasourceToSearchResult, QueryDatasourceAndPaging, SearchInfo, SearchState} from "./search.domain";
import {searchUsingSearcher} from "./search.typeclass";
import {parseSearch} from "./search.parser";

export function searchAllDataSourcesPage1<Context extends SearchContext<Context>>(context: SearchContext<Context>, searchState: SearchState): DatasourceToPromiseSearchResult {
    const {query} = searchState
    const result: DatasourceToPromiseSearchResult = {}
    for (const datasourceName of searchState.datasourceNames) {
        const from: QueryDatasourceAndPaging<undefined> = {query, datasourceName}
        result[datasourceName] = searchUsingSearcher(context, from)
    }
    return result
}

export type ParseAndSearchResult = {
    searchInfo: SearchInfo
    searchResults: DatasourceToPromiseSearchResult
}

//Please note that this is NOT an async function and shouldn't be
//It is expected to be used by state management and the result will replace searchInfo. It is the responsibility
//of the caller to do things with the promises: when they complete they should replace the results (one at a time) in searchResults
//Note that almost any aspect of the searchInfo can be changed: number of data sources being the most common. This
//happens because of the parser.
//
//It is expected that this will be called in a debounce function when the user types and the results dynamically update
export function parseAndSearchPage1<Context extends SearchContext<Context>>(context: SearchContext<Context>, startSearchInfo: SearchInfo): ParseAndSearchResult {
    const {queryParser} = context
    const {searchState: startQueryState, searchResult: startSearchResults} = startSearchInfo
    const {parsedSearchState, remove, add} = parseSearch(queryParser, startQueryState)

    const searchResult: DatasourceToSearchResult = {...startSearchResults}
    for (const datasourceName of remove) delete searchResult[datasourceName]
    for (const datasourceName of add) searchResult[datasourceName] = ({value: {datasourceName, count: startSearchInfo.count, data: [], paging: undefined}})

    const searchState: SearchState = remove.length > 0 || add.length > 0 ? {...parsedSearchState, datasourceNames: Object.keys(searchResult)} : parsedSearchState

    const searchResults: DatasourceToPromiseSearchResult = searchAllDataSourcesPage1(context, searchState)
    const searchInfo: SearchInfo = {searchState, searchResult, count: startSearchInfo.count}
    return {searchInfo, searchResults}
}

