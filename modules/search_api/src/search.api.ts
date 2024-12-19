import {DomainCaller, Headers, Method, ResultMaker, ServiceApiContext, serviceCall} from "@enterprise_search/service_caller";
import {Aggregates, QueryDatasourceAndPaging, Searcher, SearchResult, SearchTypeClass} from "@enterprise_search/search_state";
import {ErrorsOr, mapErrorsOr} from "@enterprise_search/errors";
import {NameAnd} from "@enterprise_search/recoil_utils";

export type SearchByApiContext = ServiceApiContext

export type SearchByApiTypeClass<Context, Data, Paging> = SearchTypeClass<Paging> & DataAggregatesAndPagingResultMaker<Context, Data, Paging> & DomainCaller<Context, QueryDatasourceAndPaging<Paging>, DataAggregatesAndPaging<Data, Paging>> & {
    type: 'api'
    page1: () => Promise<Paging>

    //DomainCaller
    validateFrom?: (context: Context, headers: Headers, from: QueryDatasourceAndPaging<Paging>,) => string[];
    method: (context: Context, from: QueryDatasourceAndPaging<Paging>) => Method;
    url: (context: Context, from: QueryDatasourceAndPaging<Paging>) => string;
    headers?: (context: Context, from: QueryDatasourceAndPaging<Paging>) => Promise<NameAnd<string>>;
    body?: (context: Context, from: QueryDatasourceAndPaging<Paging>) => string;

    //DataAggregatesAndPagingResultMaker
    findData: (context: Context, from: QueryDatasourceAndPaging<Paging>, headers: Headers, res: unknown) => Data[]
    findPaging: (context: Context, from: QueryDatasourceAndPaging<Paging>, headers: Headers, res: unknown) => Paging
    findAggregates?: (context: Context, from: QueryDatasourceAndPaging<Paging>, headers: Headers, res: unknown) => NameAnd<number>
    validateTo?: (context: Context, from: QueryDatasourceAndPaging<Paging>, headers: Headers, value: unknown) => ErrorsOr<DataAggregatesAndPaging<Data, Paging>>
}


export function apiSearcher<Data, Paging>(): Searcher<SearchByApiContext, SearchByApiTypeClass<SearchByApiContext, Data, Paging>, Data, Paging> {
    return async (context: SearchByApiContext, tc: SearchByApiTypeClass<SearchByApiContext, Data, Paging>, from: QueryDatasourceAndPaging<Paging>): Promise<ErrorsOr<SearchResult<Data, Paging>>> => {
        const {serviceCaller} = context
        const domainCaller: DomainCaller<SearchByApiContext, QueryDatasourceAndPaging<Paging>, DataAggregatesAndPaging<Data, Paging>> = tc
        const resultMaker = dataAggregatesAndPagingResultMaker(tc)
        const result = await serviceCall(serviceCaller)(domainCaller, resultMaker)(context, from)
        return mapErrorsOr(result, res => ({...res, count: from.query.count, datasourceName: from.datasourceName}));
    }
}

export type DataAggregatesAndPaging<Data, Paging> = {
    data: Data[]
    aggregates?: Aggregates
    paging: Paging
}

//Allows us to split up the ResultMaker into little pieces, each simpler to write and understand
//Json is the json returned by the service. We don't know it's type and at this stage we haven't validated it, so assume nothing

export type DataAggregatesAndPagingResultMaker<Context, Data, Paging> = {
    findData: (context: Context, from: QueryDatasourceAndPaging<Paging>, headers: Headers, res: unknown) => Data[]
    findPaging: (context: Context, from: QueryDatasourceAndPaging<Paging>, headers: Headers, res: unknown) => Paging
    findAggregates?: (context: Context, from: QueryDatasourceAndPaging<Paging>, headers: Headers, res: unknown) => Aggregates
}

export function dataAggregatesAndPagingResultMaker<Context, Data, Paging>(maker: DataAggregatesAndPagingResultMaker<Context, Data, Paging>): ResultMaker<Context, QueryDatasourceAndPaging<Paging>, DataAggregatesAndPaging<Data, Paging>> {
    return {
        validateTo: (context, from, headers, json): ErrorsOr<DataAggregatesAndPaging<Data, Paging>> => {
            const data = maker.findData(context, from, headers, json)
            const paging = maker.findPaging(context, from, headers, json)
            const aggregates = maker.findAggregates?.(context, from, headers, json)
            return {value: {data, aggregates, paging}}
        }
    }
}