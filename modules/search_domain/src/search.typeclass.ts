import {Aggregates, QueryDatasourceAndPaging, SearchQuery, SearchResult} from "./search.domain";
import {NameAnd} from "@laoban/utils";
import {DomainCaller, Headers, Method, ResultMaker, serviceCall, ServiceCallDebug, ServiceCaller} from "@enterprise_search/service_caller";
import {ErrorsOr, mapErrorsOr} from "@enterprise_search/errors";


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

export type SearchTypeClass<Context, Data, Paging> = DataAggregatesAndPagingResultMaker<Context, Data, Paging> & DomainCaller<Context, QueryDatasourceAndPaging<Paging>, DataAggregatesAndPaging<Data, Paging>> & {
    type: 'api'
    page1: () => Paging

    //DomainCaller
    validateFrom?: (context: Context, headers: Headers, from: QueryDatasourceAndPaging<Paging>,) => string[];
    method: (context: Context, from: QueryDatasourceAndPaging<Paging>) => Method;
    url: (context: Context, from: QueryDatasourceAndPaging<Paging>) => string;
    headers?: (context: Context, from: QueryDatasourceAndPaging<Paging>) => NameAnd<string>;
    body?: (context: Context, from: QueryDatasourceAndPaging<Paging>) => string;

    //DataAggregatesAndPagingResultMaker
    findData: (context: Context, from: QueryDatasourceAndPaging<Paging>, headers: Headers, res: unknown) => Data[]
    findPaging: (context: Context, from: QueryDatasourceAndPaging<Paging>, headers: Headers, res: unknown) => Paging
    findAggregates?: (context: Context, from: QueryDatasourceAndPaging<Paging>, headers: Headers, res: unknown) => NameAnd<number>
    validateTo: (context: Context, from: QueryDatasourceAndPaging<Paging>, headers: Headers, value: unknown) => ErrorsOr<DataAggregatesAndPaging<Data, Paging>>
}
export type DatasourceNameToSearchTypeClass<Context> = NameAnd<SearchTypeClass<Context, any, any>>


export function findSearchTc<Context, Data, Paging>(searchTcs: DatasourceNameToSearchTypeClass<Context>, datasourceName: string): SearchTypeClass<Context, Data, Paging> {
    const result = searchTcs[datasourceName];
    if (!result) throw new Error(`No search type class for datasource ${datasourceName}. Legal values are ${Object.keys(searchTcs).sort().join(', ')}`);
    return result as SearchTypeClass<Context, Data, Paging>;
}


//This is the initial search. It searchs page 1 of the datasource
//The count enables us to ensure that we don't have slow searches overwriting fast ones
export async function searchOneDataSource<Context, Data, Paging>(serviceCaller: ServiceCaller<any, any>, context: Context, searchTcs: DatasourceNameToSearchTypeClass<Context>, query: SearchQuery, datasourceName: string, debug: ServiceCallDebug): Promise<ErrorsOr<SearchResult<Data, Paging>>> {
    const count = query.count;
    const searchTC = findSearchTc<Context, Data, Paging>(searchTcs, datasourceName)
    const from = {query, datasourceName, paging: searchTC.page1()}

    const domainCaller: DomainCaller<Context, QueryDatasourceAndPaging<Paging>, DataAggregatesAndPaging<Data, Paging>> = searchTC
    const resultMaker: ResultMaker<Context, QueryDatasourceAndPaging<Paging>, DataAggregatesAndPaging<Data, Paging>> = dataAggregatesAndPagingResultMaker(searchTC)
    const rawResult = await serviceCall(serviceCaller)(domainCaller, context, resultMaker, debug)(from)

    return mapErrorsOr(rawResult, raw => ({...raw, count, datasourceName}));
}

export async function scrollOneDataSource<Context, Data, Paging>(serviceCaller: ServiceCaller<any, any>, context: Context, searchTcs: DatasourceNameToSearchTypeClass<Context>, existing: SearchResult<Data, Paging>, query: SearchQuery, debug: ServiceCallDebug): Promise<ErrorsOr<SearchResult<Data, Paging>>> {
    const datasourceName = existing.datasourceName;
    const count = existing.count;
    const searchTC = findSearchTc<Context, Data, Paging>(searchTcs, datasourceName)
    const from: QueryDatasourceAndPaging<Paging> = {query, paging: existing.paging, datasourceName}
    const existingData = existing.data

    const domainCaller: DomainCaller<Context, QueryDatasourceAndPaging<Paging>, DataAggregatesAndPaging<Data, Paging>> = searchTC
    const resultMaker: ResultMaker<Context, QueryDatasourceAndPaging<Paging>, DataAggregatesAndPaging<Data, Paging>> = dataAggregatesAndPagingResultMaker(searchTC)
    const rawResult = await serviceCall(serviceCaller)(domainCaller, context, resultMaker, debug)(from)

    return mapErrorsOr(rawResult, raw => ({...raw, count, datasourceName, data: [...existingData, ...raw.data]}));
}


