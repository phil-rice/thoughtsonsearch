import {SearchByApiContext} from "@enterprise_search/search_api";
import {CommonDataSourceDetails, DataSourcePlugin} from "@enterprise_search/react_datasource_plugin";
import {TimeFilters} from "@enterprise_search/react_time_filter_plugin";
import {Authentication} from "@enterprise_search/authentication";
import {DataViewFilters} from "@enterprise_search/react_data_views_filter_plugin";
import {KeywordsFilter} from "@enterprise_search/react_keywords_filter_plugin";

/* This lets us say 'in the elastic search I want you to search these indicies
The indicies are the 'ones that are known'. Filters can trim this down
 */
export const elasticSearchDsName = 'elasticSearch';

export type ElasticSearchSourceDetails = CommonDataSourceDetails & {}

export type ElasticSearchContext = SearchByApiContext & {
    elasticSearchUrl: string
    elasticSearchToken: () => Promise<string>
    knownIndicies: string[]
}

export type ElasticSearchPaging = {}
export type ElasticSearchFilters = KeywordsFilter & TimeFilters & DataViewFilters

export function elasticSearchDataSourcePlugin(authentication: Authentication): DataSourcePlugin<ElasticSearchSourceDetails, ElasticSearchFilters, ElasticSearchPaging> {
    return {
        plugin: 'datasource',
        datasourceName: elasticSearchDsName,
        authentication,
        fetch: async ({
                          debug, errorReporter, dataView
                          , throwError
                      }, searchType, filters, paging) => {
            const allowedNames = filters.dataviews?.allowedNames || []
            const rawSelectedNames = filters.dataviews?.selectedNames || []
            const selectedNames = rawSelectedNames.length === 0 ? allowedNames : rawSelectedNames
            debug('elastic-search', dataView, filters, 'paging',paging, 'selectedNames', selectedNames)
            const esDataSources: CommonDataSourceDetails[] = dataView.datasources.filter(ds => ds.type === elasticSearchDsName)
            const indicies = esDataSources.flatMap(ds => ds.names).filter(n => selectedNames.includes(n))
            debug('elastic-search', 'esDataSources', esDataSources,'indicies', indicies)
            const findThings = Object.entries(dataView).filter(f => true);
            const msg = `not implemented - ${searchType} ${JSON.stringify(filters)}} - Paging (${JSON.stringify(paging)}) - Auth ${authentication.name}`;
            return await errorReporter({errors: [msg], extras: {searchType, filters,indicies, paging}})
        },
    };
}


