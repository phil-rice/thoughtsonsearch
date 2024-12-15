import {SearchContext} from "./search.context";
import {DatasourceToPromiseSearchResult, DatasourceToSearchResult, SearchInfo, SearchState} from "./search.domain";
import {searchOneDataSource} from "./search.typeclass";
import {ServiceCallDebug} from "@enterprise_search/service_caller";
import {parseSearch} from "./search.parser";


//two scenarios:
// The user has pressed a newline or the search button. In this case queryAnd result are the full
// Or the user is typing has paused and we get intermediate results
export function searchAllDataSources(context: SearchContext, parserState: SearchState, debug: ServiceCallDebug): DatasourceToPromiseSearchResult {
    const {tcs, serviceCaller} = context
    const {query} = parserState

    const result: DatasourceToPromiseSearchResult = {}

    for (const datasourceName of parserState.datasourceNames) {
        const tc = tcs[datasourceName]
        if (!tc) throw new Error(`Trying to access unknown data source ${datasourceName}. Legal values are ${Object.keys(tc).sort()}`)
        result[datasourceName] = searchOneDataSource(serviceCaller, context, tcs, query, datasourceName, debug)
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
export function parseAndSearch(context: SearchContext, startSearchInfo: SearchInfo, debug: ServiceCallDebug): ParseAndSearchResult {
    const {queryParser} = context
    const {searchState: startQueryState, searchResult: startSearchResults} = startSearchInfo
    const {searchState, remove, add} = parseSearch(queryParser, startQueryState)

    const searchResult: DatasourceToSearchResult = {...startSearchResults}
    for (const datasourceName of remove) delete searchResult[datasourceName]
    for (const datasourceName of add) searchResult[datasourceName] = ({value: {datasourceName, count: startSearchInfo.count, data: [], paging: undefined}})

    const searchResults: DatasourceToPromiseSearchResult = searchAllDataSources(context, startQueryState, debug)
    const searchInfo: SearchInfo = {searchState, searchResult, count: startSearchInfo.count}
    return {searchInfo, searchResults}
}

