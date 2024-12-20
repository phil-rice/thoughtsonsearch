import {KeywordsFilter} from "@enterprise_search/react_keywords_filter";
import {DatasourceToPromiseSearchResult, DatasourceToSearchResult, QueryDatasourceAndPaging, SearchResult, SearchState, SearchType} from "@enterprise_search/search_state";
import {SearchParser} from "@enterprise_search/react_search_parser";
import {ErrorsOr} from "@enterprise_search/errors";
import {DataSourcePlugins} from "@enterprise_search/react_datasource_plugin";

export function searchAllDataSourcesPage1<Filters>(plugins: DataSourcePlugins<Filters>, filters: Filters): DatasourceToPromiseSearchResult {
    const result: DatasourceToPromiseSearchResult = {}
    for (const [datasourceName, plugin] of Object.entries(plugins)) {
        result[datasourceName] = plugin.fetch(filters)
    }
    return result
}

export function intermediateSearch<Filters extends KeywordsFilter>(plugins: DataSourcePlugins<Filters>,
                                                                   parser: SearchParser<Filters>,
                                                                   setIntermediateFilters: (filters: Filters) => void,
                                                                   setResult: (st: SearchType, datasourceName: string, res: ErrorsOr<SearchResult<any, any>>) => void,
                                                                   searchState: SearchState<any>,) {
    const {searches, searchQuery} = searchState
    const {main, immediate} = searches
    const newImmediate = parser(searchQuery, main.filters);
    setIntermediateFilters(newImmediate)
    const result: DatasourceToPromiseSearchResult = searchAllDataSourcesPage1(plugins, newImmediate)
    for (const [datasourceName, promise] of Object.entries(result)) {
        promise.then(res => setResult('immediate', datasourceName, res))
    }
}