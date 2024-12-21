import {DomainCaller, Headers, Method, ResultMaker, ServiceApiContext, serviceCall} from "@enterprise_search/service_caller";
import {Aggregates, QueryDatasourceAndPaging, Searcher, SearchResult, SearchTypeClass} from "@enterprise_search/search_state";
import {ErrorsOr, mapErrorsOr} from "@enterprise_search/errors";
import {NameAnd} from "@enterprise_search/recoil_utils";

export type SearchByApiContext = ServiceApiContext

export type SearchByApiTypeClass<Context, Filters, Data, Paging> = SearchTypeClass<Context, Filters, Paging> & DataAggregatesAndPagingResultMaker<Context, Filters, Data, Paging> & DomainCaller<Context, QueryDatasourceAndPaging<Filters, Paging>, DataAggregatesAndPaging<Data, Paging>> & {
    type: 'api'
    page1: () => Promise<Paging>

    //DomainCaller
    validateFrom?: (context: Context, headers: Headers, from: QueryDatasourceAndPaging<Filters, Paging>,) => string[];
    method: (context: Context, from: QueryDatasourceAndPaging<Filters, Paging>) => Method;
    url: (context: Context, from: QueryDatasourceAndPaging<Filters, Paging>) => string;
    headers?: (context: Context, from: QueryDatasourceAndPaging<Filters, Paging>) => Promise<NameAnd<string>>;
    body?: (context: Context, from: QueryDatasourceAndPaging<Filters, Paging>) => string;

    //DataAggregatesAndPagingResultMaker
    findData: (context: Context, from: QueryDatasourceAndPaging<Filters, Paging>, headers: Headers, res: unknown) => Data[]
    findPaging: (context: Context, from: QueryDatasourceAndPaging<Filters, Paging>, headers: Headers, res: unknown) => Paging
    findAggregates?: (context: Context, from: QueryDatasourceAndPaging<Filters, Paging>, headers: Headers, res: unknown) => NameAnd<number>
    validateTo?: (context: Context, from: QueryDatasourceAndPaging<Filters, Paging>, headers: Headers, value: unknown) => ErrorsOr<DataAggregatesAndPaging<Data, Paging>>
}


export function apiSearcher<Filters, Data, Paging>(): Searcher<SearchByApiContext, SearchByApiTypeClass<SearchByApiContext, Filters, Data, Paging>, Filters, Data, Paging> {
    return async (context: SearchByApiContext, tc: SearchByApiTypeClass<SearchByApiContext, Filters, Data, Paging>, from: QueryDatasourceAndPaging<Filters, Paging>): Promise<ErrorsOr<SearchResult<Data, Paging>>> => {
        const {serviceCaller} = context
        const domainCaller: DomainCaller<SearchByApiContext, QueryDatasourceAndPaging<Filters, Paging>, DataAggregatesAndPaging<Data, Paging>> = tc
        const resultMaker = dataAggregatesAndPagingResultMaker(tc)
        const result = await serviceCall(serviceCaller)(domainCaller, resultMaker)(context, from)
        return mapErrorsOr(result, res => ({...res, count: from.count, datasourceName: from.datasourceName}));
    }
}

export type DataAggregatesAndPaging<Data, Paging> = {
    data: Data[]
    aggregates?: Aggregates
    paging: Paging
}

//Allows us to split up the ResultMaker into little pieces, each simpler to write and understand
//Json is the json returned by the service. We don't know it's type and at this stage we haven't validated it, so assume nothing

export type DataAggregatesAndPagingResultMaker<Context, Filters, Data, Paging> = {
    findData: (context: Context, from: QueryDatasourceAndPaging<Filters, Paging>, headers: Headers, res: unknown) => Data[]
    findPaging: (context: Context, from: QueryDatasourceAndPaging<Filters, Paging>, headers: Headers, res: unknown) => Paging
    findAggregates?: (context: Context, from: QueryDatasourceAndPaging<Filters, Paging>, headers: Headers, res: unknown) => Aggregates
}

export function dataAggregatesAndPagingResultMaker<Context, Filters, Data, Paging>(maker: DataAggregatesAndPagingResultMaker<Context, Filters, Data, Paging>): ResultMaker<Context, QueryDatasourceAndPaging<Filters, Paging>, DataAggregatesAndPaging<Data, Paging>> {
    return {
        validateTo: (context, from, headers, json): ErrorsOr<DataAggregatesAndPaging<Data, Paging>> => {
            const data = maker.findData(context, from, headers, json)
            const paging = maker.findPaging(context, from, headers, json)
            const aggregates = maker.findAggregates?.(context, from, headers, json)
            return {value: {data, aggregates, paging}}
        }
    }
}