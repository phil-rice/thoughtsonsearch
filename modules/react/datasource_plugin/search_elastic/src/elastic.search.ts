import {CommonDataSourceDetails, DataSourcePlugin} from "@enterprise_search/react_datasource_plugin";
import {Authentication} from "@enterprise_search/authentication";
import {DataViewFilters} from "@enterprise_search/react_data_views_filter_plugin";
import {KeywordsFilter} from "@enterprise_search/react_keywords_filter_plugin";
import {DataView} from "@enterprise_search/data_views";
import {ServiceCaller, ServiceRequest} from "@enterprise_search/service_caller";
import {isErrors, mapErrorsOr} from "@enterprise_search/errors";
import {TimeFilters} from "@enterprise_search/react_time_filter_plugin";

/* This lets us say 'in the elastic search I want you to search these indicies
The indicies are the 'ones that are known'. Filters can trim this down
 */
export const elasticSearchDsName = 'elasticSearch';

export type ElasticSearchSourceDetails = CommonDataSourceDetails & {}

export type ElasticSearchPaging = {}
export type ElasticSearchFilters = KeywordsFilter & TimeFilters & DataViewFilters

function findIndicies<Filters extends ElasticSearchFilters>(dataView: DataView<any>, filters: Filters) {
    const allowedNames = filters.dataviews?.allowedNames || []
    const rawSelectedNames = filters.dataviews?.selectedNames || []
    const selectedNames = rawSelectedNames.length === 0 ? allowedNames : rawSelectedNames
    const esDataSources: CommonDataSourceDetails[] = dataView.datasources.filter(ds => ds.type === elasticSearchDsName)
    const indicies = esDataSources.flatMap(ds => ds.names).filter(n => selectedNames.includes(n))
    return indicies
}

function findTimeFilter<Filters extends TimeFilters>(context: ElasticSearchContext, filter: Filters) {
    return undefined
}

function findSpacesFilter<Filters extends DataViewFilters>(context: ElasticSearchContext, filter: Filters) {
    return undefined
}

const excludes = [
    "full_text_embeddings",
    "full_text",
    "file",
    "pdf file path",
    "pdf",
];
const boosts = [
    `issue`,
    `title`,
    `name`,
    `card_title`,
]

function findKeywordFilter<Filters extends KeywordsFilter>(context: ElasticSearchContext, filter: Filters) {
    const keywords = filter.keywords
    return {
        dis_max: {
            queries: [
                {
                    multi_match: {
                        "query": `*${keywords}*`,
                        fields: boosts,
                        type: "best_fields",
                        boost: 1.5
                    }
                },
                {
                    "query_string": {
                        type: 'phrase_prefix',
                        "default_field": "full_text",
                        "query": `*${keywords}*`,
                        "boost": 1.5,
                        "default_operator": "AND",
                        "phrase_slop": 1
                    }
                },
                {
                    "query_string": {
                        "query": keywords,

                        "boost": 1,
                        "default_operator": "OR",
                    }
                }
            ]
        }
    }
}

export function composeFilters(...raw: any[]): any {
    const filters = raw.filter(Boolean)
    if (filters.length === 0) return {"match_none": {}}
    if (filters.length === 1) return filters[0]
    return {
        bool: {
            must: filters
        }
    }
}

export type ElasticSearchContext = {
    elasticSearchUrl: string
    serviceCaller: ServiceCaller<any>
    knownIndicies: string[]
    authentication: Authentication
}


export function elasticSearchDataSourcePlugin(context: ElasticSearchContext):
    DataSourcePlugin<ElasticSearchSourceDetails, ElasticSearchFilters, ElasticSearchPaging> {
    return {
        plugin: 'datasource',
        datasourceName: elasticSearchDsName,
        fetch: async ({
                          debug, errorReporter, dataView
                          , throwError
                      }, searchType, filters, resultSize, paging) => {
            const {elasticSearchUrl, serviceCaller, knownIndicies, authentication} = context
            const indicies = findIndicies(dataView, filters)
            if (indicies.some(i => !knownIndicies.includes(i)))
                throwError('s/w', `Unknown indicies ${indicies.sort()}. Known indicies are ${knownIndicies.sort()}`)
            const timeFilter = findTimeFilter(context, filters)
            const spacesFilter = findSpacesFilter(context, filters)
            const keywordFilter = findKeywordFilter(context, filters)
            const query = {query: composeFilters(timeFilter, spacesFilter, keywordFilter)}
            debug.debugError(new Error('test'),'debugerror', debug)
            debug('elasticSearchDataSourcePlugin', {searchType, filters, indicies, paging})
            const body = {
                size: resultSize,
                // from: 0,
                _source: {
                    excludes: excludes,
                },
                query,
                sort: [
                    {_score: {order: "desc",},},
                    {_id: {order: "asc",},},
                ],
                aggregations: {
                    count: {
                        terms: {
                            field: "_index",
                        },
                    },
                },
            }
            debug('elasticSearchDataSourcePlugin', {body})
            const sr: ServiceRequest = {
                method: 'POST',
                url: `${elasticSearchUrl}/_search`,
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json',}
            }

            const resp = mapErrorsOr(await serviceCaller(context, sr), resp => JSON.parse(resp.body))
            if (isErrors(resp)) return await errorReporter(resp)
            return resp
        },
    };
}


