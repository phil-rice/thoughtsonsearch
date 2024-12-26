import {DatasourceToPromiseSearchResult, OneSearch, SearchResult, SearchState, SearchType, searchTypes} from "@enterprise_search/search_state";
import {SearchParser} from "@enterprise_search/react_search_parser";
import {ErrorsOr, ThrowError} from "@enterprise_search/errors";
import {DataSourcePlugins, useDataSourcePlugins} from "@enterprise_search/react_datasource_plugin";
import {useGuiFilters, useGuiSearchQuery} from "@enterprise_search/search_gui_state";
import {KeywordsFilter} from "@enterprise_search/react_keywords_filter_plugin";
import React, {ReactNode, useEffect, useRef} from "react";
import {useFiltersByStateType, useOneFilterBySearchType, useSearchResultsByStateType, useSearchState} from "@enterprise_search/react_search_state";
import {lensBuilder} from "@enterprise_search/optics";
import {DebugLog, ErrorReporter, useDebug, useErrorReporter, useThrowError} from "@enterprise_search/react_utils";

export const searchDebug = 'search'

export type DoTheSearchingProps = {
    children: ReactNode
}

const countL = lensBuilder<OneSearch<any>>().focusOn('count')

function useDoSearch(st: SearchType) {
    const debug = useDebug(searchDebug)
    const errorReporter = useErrorReporter()
    const throwError = useThrowError()
    const searchCapabilities: SearchCapabilities = {debug, throwError: throwError, errorReporter}
    const [filters] = useFiltersByStateType(st)
    const dataSourcePlugins = useDataSourcePlugins()
    const [searchResults, setSearchResults] = useSearchResultsByStateType(st)
    const countRef = useRef(0)
    useEffect(() => {
        if (Object.keys(filters).length === 0) return //removes calls at start up, and this isn't a credible search anyway
        const baseCount = countRef.current + 1
        //when we do a new search we increment the count. We then check this in the result and ignore results if count has changed
        //we need it in a ref so that we can use it in the promise.then
        //we put it in the state to help with debugging: we can see it in the debug guis
        countRef.current = baseCount
        setSearchResults(countL.set(searchResults, baseCount))
        debug(st, baseCount, 'filters', filters)
        const result: DatasourceToPromiseSearchResult = searchAllDataSourcesPage1(searchCapabilities, st, dataSourcePlugins, filters)
        for (const [datasourceName, promise] of Object.entries(result)) {
            promise.then(res => {
                if (baseCount !== countRef.current) return debug(st, baseCount, '!==', countRef.current, 'ignoring result')//ignore the result if the count has changed because there is another search on the way already
                const lens = lensBuilder<OneSearch<any>>().focusOn('dataSourceToSearchResult').focusOn(datasourceName)
                setSearchResults(old => {
                    const result = lens.set(old, res);
                    debug(st, baseCount, 'result', datasourceName, res, 'old', old, 'new', result)
                    return result;
                })
            }).catch(e => {
                debug.debugError(e, st, baseCount, 'error') // Note this only logs the error if debug is on. We need a proper error handling system
            })
        }
    }, [filters, dataSourcePlugins])
}

/* This component monitors the state of the search. If changed it triggers a search  and updates the search results */
export function DoTheSearching({children}: DoTheSearchingProps) {
    for (const st of searchTypes)
        useDoSearch(st)
    return <>{children}</>
}

export type SearchCapabilities = {
    debug: DebugLog
    throwError: ThrowError
    errorReporter: ErrorReporter
}

export function searchAllDataSourcesPage1<Filters>(searchCapabilities: SearchCapabilities, searchType: SearchType, plugins: DataSourcePlugins<Filters>, filters: Filters): DatasourceToPromiseSearchResult {
    const result: DatasourceToPromiseSearchResult = {}
    const {debug} = searchCapabilities
    debug('searchAllDataSourcesPage1', plugins, filters)
    for (const [datasourceName, plugin] of Object.entries(plugins)) {
        debug(datasourceName, 'starting to fetch from plugin', plugin)
        result[datasourceName] = plugin.fetch(searchCapabilities, searchType, filters)
    }
    return result
}

export function intermediateSearch<Filters extends KeywordsFilter>(searchCapabilities: SearchCapabilities,
                                                                   plugins: DataSourcePlugins<Filters>,
                                                                   parser: SearchParser<Filters>,
                                                                   setIntermediateFilters: (filters: Filters) => void,
                                                                   setResult: (st: SearchType, datasourceName: string, res: ErrorsOr<SearchResult<any, any>>) => void,
                                                                   searchState: SearchState<any>,) {
    const {searches} = searchState
    const {main, immediate} = searches
    const [searchQuery] = useGuiFilters()
    const newImmediate = parser(searchQuery, main.filters);
    setIntermediateFilters(newImmediate)
    const result: DatasourceToPromiseSearchResult = searchAllDataSourcesPage1(searchCapabilities, 'immediate', plugins, newImmediate)
    for (const [datasourceName, promise] of Object.entries(result)) {
        promise.then(res => setResult('immediate', datasourceName, res))
    }
}