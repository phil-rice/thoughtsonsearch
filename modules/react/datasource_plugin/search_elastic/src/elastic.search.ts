import {SearchByApiContext, SearchByApiTypeClass} from "@enterprise_search/search_api";
import {KeywordsFilter} from "@enterprise_search/react_keywords_filter_plugin";
import {TimeFilters} from "@enterprise_search/react_time_filter_plugin";

export type ElasticSearchContext = SearchByApiContext & {
    elasticSearchUrl: string
    elasticSearchToken: () => Promise<string>
}

type ElasticSearchPaging = {}
export type ElasticSearchFilters = KeywordsFilter & TimeFilters

const elasticSearchTC: SearchByApiTypeClass<ElasticSearchContext, ElasticSearchFilters, any, ElasticSearchPaging> = {
    type: 'api',
    page1: async () => ({}),
    url: (context, from) => `${context.elasticSearchUrl}/_search`,
    body: (context, from) => {
        const keywordsFilter = keywordsFilterToElasticSearchFilter(from.filters.keywords)
        const timeFilter = timeFilterToElasticSearchFilter(from.filters.time)
        const paging = from.paging
        return JSON.stringify({paging, keywordsFilter, timeFilter});
    },
    method: () => `Post`,
    headers: async (context) => ({Authorization: `Bearer ${await context.elasticSearchToken()}`}),
    findAggregates: () => ({}),
    findData: (context, from, headers, res: any) => (res.hits),
    findPaging: (context, from, headers, res: any) => ({}),
}

export function timeFilterToElasticSearchFilter(timeFilter: TimeFilters): any {
    return {}
}

export function keywordsFilterToElasticSearchFilter(keywordsFilter: KeywordsFilter): any {
    return {}
}
