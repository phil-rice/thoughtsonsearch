import {CommonDataSourceDetails, DataSourcePlugin, FetchResult} from "@enterprise_search/react_datasource_plugin";
import {Authentication} from "@enterprise_search/authentication";
import {DataViewFilters} from "@enterprise_search/react_data_views_filter_plugin";
import {KeywordsFilter} from "@enterprise_search/react_keywords_filter_plugin";
import {DataView} from "@enterprise_search/data_views";
import {ServiceCaller, ServiceRequest, ServiceResponse} from "@enterprise_search/service_caller";
import {ErrorsOr, isErrors, ThrowError} from "@enterprise_search/errors";
import {TimeFilters} from "@enterprise_search/react_time_filter_plugin";
import {MakeElasticSearchQueryFromFilters, makeElasticSearchQueryFromFilters} from "./elastic.search.filters";
import {MakeBodyFromQuery, makeBodyFromQuery} from "./elastic.search.body";
import {TimeService} from "@enterprise_search/recoil_utils";

/* This lets us say 'in the elastic search I want you to search these indices
The indices are the 'ones that are known'. Filters can trim this down
 */
export const elasticSearchDsName = 'elasticSearch';

export type ElasticSearchSourceDetails = CommonDataSourceDetails & {}

export type ElasticSearchPaging = {}
export type ElasticSearchFilters = KeywordsFilter & TimeFilters & DataViewFilters

function findIndices<Filters extends ElasticSearchFilters>(dataView: DataView<any>, filters: Filters) {
    const allowedNames = filters.dataviews?.allowedNames || []
    const rawSelectedNames = filters.dataviews?.selectedNames || []
    const selectedNames = rawSelectedNames.length === 0 ? allowedNames : rawSelectedNames
    const esDataSources: CommonDataSourceDetails[] = dataView.datasources.filter(ds => ds.type === elasticSearchDsName)
    const indices = esDataSources.flatMap(ds => ds.names).filter(n => selectedNames.includes(n))
    return indices
}


export type ElasticSearchContext = {
    timeService: TimeService,
    elasticSearchUrl: string
    serviceCaller: ServiceCaller<any>
    knownIndices: string[]
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

export function validateElasticSearch(context: ElasticSearchContext) {
    return () => {
        const errors: string[] = []
        if (!context.elasticSearchUrl) errors.push('elasticSearchUrl is required')
        if (!context.serviceCaller) errors.push('serviceCaller is required')
        if (!context.knownIndices) errors.push('knownIndices is required')
        errors.push(...context.authentication.validate())
        return errors
    };
}

export type ProcessResponse = (response: ServiceResponse<ElasticSearchResponse>, throwError: ThrowError) => ErrorsOr<FetchResult<any, any>>
export const processResponse: ProcessResponse = (response: ServiceResponse<ElasticSearchResponse>, throwError: ThrowError) => {
    const raw = response.body?.hits?.hits;
    if (!raw) return throwError('s/w', 'No hits in elastic search response', response)
    const data = raw.map(r => {
        const {_source, ...rest} = r;
        return {..._source, ...rest}
    });
    return {value: {data, paging: undefined}}
};

export function fetchElasticSearch(context: ElasticSearchContext,
                            _makeElasticSearchQueryFromFilters: MakeElasticSearchQueryFromFilters = makeElasticSearchQueryFromFilters,
                            _makeBodyFromQuery: MakeBodyFromQuery = makeBodyFromQuery,
                            _processResponse: ProcessResponse = processResponse) {
    return async ({debug, errorReporter, dataView, throwError},
                  searchType, filters, resultSize, paging): Promise<ErrorsOr<FetchResult<any, any>>> => {
        const {elasticSearchUrl, serviceCaller, knownIndices, authentication} = context
        const fullContext = {...context, debug}
        const indices = findIndices(dataView, filters)
        if (indices.some(i => !knownIndices.includes(i)))
            throwError('s/w', `Unknown indices ${indices.sort()}. Known indices are ${knownIndices.sort()}`)
        if (indices.length === 0) {
            debug('no specified indices', 'known indices', knownIndices, 'filters', filters)
            return {value: {data: [], paging: undefined}}
        }
        const query = _makeElasticSearchQueryFromFilters(context, filters);
        debug('elasticSearchDataSourcePlugin', {searchType, filters, indices, paging})
        const body = _makeBodyFromQuery(resultSize, query);
        debug('elasticSearchDataSourcePlugin', {body})
        const sr: ServiceRequest<ElasticSearchResponse> = {
            method: 'POST',
            url: `${elasticSearchUrl}/${indices.join(',')}/_search`,
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json',}
        }

        const response = await serviceCaller(fullContext, sr);
        if (isErrors(response)) return await errorReporter(response)
        return _processResponse(response.value, throwError);
    };
}

export function elasticSearchDataSourcePlugin(context: ElasticSearchContext):
    DataSourcePlugin<ElasticSearchSourceDetails, ElasticSearchFilters, ElasticSearchPaging> {
    return {
        plugin: 'datasource',
        datasourceName: elasticSearchDsName,
        validate: validateElasticSearch(context),
        fetch: fetchElasticSearch(context),
    };
}


