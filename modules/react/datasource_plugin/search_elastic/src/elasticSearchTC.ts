import {KeywordsFilter} from "modules/react/filters_plugin/react_keywords_filter_plugin";
import {SearchByApiTypeClass} from "@enterprise_search/search_api";
import {TimeFilters} from "@enterprise_search/react_time_filter_plugin";
import {ElasticSearchContext, ElasticSearchFilters, ElasticSearchPaging} from "./elastic.search";
import {DataViewFilters} from "@enterprise_search/react_data_views_filter_plugin";

export const elasticSearchTC: SearchByApiTypeClass<ElasticSearchContext, ElasticSearchFilters, any, ElasticSearchPaging> = {
    type: 'api',
    page1: async () => ({}),
    url: (context, from) => `${context.elasticSearchUrl}/_search`,
    body: (context, from) => {
        const keywordsFilter = keywordsFilterToElasticSearchFilter(from.filters)
        const timeFilter = timeFilterToElasticSearchFilter(from.filters)
        const dataSourcesFilter = dataSourcesFilterToElasticSearchFilter(from.filters)
        const paging = from.paging
        return JSON.stringify({paging, keywordsFilter, timeFilter});
    },
    method: () => `Post`,
    headers: async (context) => ({Authorization: `Bearer ${await context.elasticSearchToken()}`}),
    findAggregates: () => ({}),
    findData: (context, from, headers, res: any) => (res.hits),
    findPaging: (context, from, headers, res: any) => ({}),
}

export function dataSourcesFilterToElasticSearchFilter(dataSourceFilter: DataViewFilters): any {
    //will add info about indicies. Handling the undefined case as meaning all indicies
    return {}
}

export function timeFilterToElasticSearchFilter(timeFilter: TimeFilters): any {
    return {}
}

export function keywordsFilterToElasticSearchFilter(keywordsFilter: KeywordsFilter): any {
    return {}
}