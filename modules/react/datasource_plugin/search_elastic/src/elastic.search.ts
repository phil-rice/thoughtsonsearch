import {CommonDataSourceDetails, DataSourcePlugin, FetchResult} from "@enterprise_search/react_datasource_plugin";
import {Authentication} from "@enterprise_search/authentication";
import {DataViewFilters} from "@enterprise_search/react_data_views_filter_plugin";
import {KeywordsFilter} from "@enterprise_search/react_keywords_filter_plugin";
import {DataView} from "@enterprise_search/data_views";
import {ServiceCaller, ServiceRequest} from "@enterprise_search/service_caller";
import {ErrorsOr, isErrors, mapErrorsOr} from "@enterprise_search/errors";
import {TimeFilters} from "@enterprise_search/react_time_filter_plugin";
import {SearchResult} from "@enterprise_search/search_state";

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

type ElasticSearchResponse = {
    hits: {
        total: {
            value: number
        }
        hits: any[]
    }
}

export function elasticSearchDataSourcePlugin(context: ElasticSearchContext):
    DataSourcePlugin<ElasticSearchSourceDetails, ElasticSearchFilters, ElasticSearchPaging> {
    return {
        plugin: 'datasource',
        datasourceName: elasticSearchDsName,
        validate: () => {
            const errors: string[] = []
            if (!context.elasticSearchUrl) errors.push('elasticSearchUrl is required')
            if (!context.serviceCaller) errors.push('serviceCaller is required')
            if (!context.knownIndicies) errors.push('knownIndicies is required')
            errors.push(...context.authentication.validate())
            return errors
        },
        fetch: async ({debug, errorReporter, dataView, throwError},
                      searchType, filters, resultSize, paging): Promise<ErrorsOr<FetchResult<any, any>>> => {
            const {elasticSearchUrl, serviceCaller, knownIndicies, authentication} = context
            const fullContext = {...context, debug}
            const indicies = findIndicies(dataView, filters)
            if (indicies.some(i => !knownIndicies.includes(i)))
                throwError('s/w', `Unknown indicies ${indicies.sort()}. Known indicies are ${knownIndicies.sort()}`)
            if (indicies.length === 0) {
                debug('no specified indicies', 'known indicies', knownIndicies, 'filters', filters)
                return {value: {data: [], paging: undefined}}
            }
            const timeFilter = findTimeFilter(context, filters)
            const spacesFilter = findSpacesFilter(context, filters)
            const keywordFilter = findKeywordFilter(context, filters)
            const query = {query: composeFilters(timeFilter, spacesFilter, keywordFilter)}
            debug('elasticSearchDataSourcePlugin', {searchType, filters, indicies, paging})
            const body = {
                size: resultSize,
                // from: 0,
                _source: {
                    excludes: excludes,
                },
                ...query,
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

            const sr: ServiceRequest<ElasticSearchResponse> = {
                method: 'POST',
                url: `${elasticSearchUrl}/${indicies.join(',')}/_search`,
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json',}
            }

            const response = await serviceCaller(fullContext, sr);
            if (isErrors(response)) return await errorReporter(response)
            const raw = response.value.body?.hits?.hits;
            if (!raw) return throwError('s/w', 'No hits in elastic search response', response)
            const data = raw.map(r => {
                const {_source, ...rest} = r;
                return {..._source, ...rest}
            });
            return {value: {data, paging: undefined}}
        },
    };
}


