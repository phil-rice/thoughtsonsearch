import {SearchByApiContext, SearchByApiTypeClass} from "@enterprise_search/search_api/src/search.api";

export type ElasticSearchContext = SearchByApiContext

type ElasticSearchPaging = {}
const elasticSearchTC: SearchByApiTypeClass<ElasticSearchContext, any, ElasticSearchPaging> = {
    type: 'api',
    page1: () => ({}),
    url: (context, from) => ``,
    body: (context, from) => JSON.stringify({}),
    method: () => `Post`,
    headers: async () => ({}),
    findAggregates: (context, from) => ({}),
    findData: (context, from) => ([]),
    findPaging: (context, from) => ({}),
}
