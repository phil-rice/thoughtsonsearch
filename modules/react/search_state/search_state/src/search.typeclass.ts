import {QueryDatasourceAndPaging, SearchResult} from "./search.state";

import {ErrorsOr, mapErrorsOr, ReportError} from "@enterprise_search/errors";
import {DebugContext} from "@enterprise_search/debug";
import {NameAnd} from "@enterprise_search/recoil_utils";

//We will have several of these. They are very high level
//For example 'searches by means of an api', 'builds up a query using gen ai and then calls an api', 'does some rag, does ai, calls an api with query from ai'
export type SearchTypeClass<Context, Filters, Paging> = {
    type: string
    page1: (context: Context, query: QueryDatasourceAndPaging<Filters, Paging>) => Promise<Paging>
}
export type DatasourceNameToSearchTypeClass<Context, Filters, Paging> = NameAnd<SearchTypeClass<Context, Filters, Paging>>

export function findSearchTc<Context, Filters, Paging>(reportError: ReportError, searchTcs: DatasourceNameToSearchTypeClass<Context, Filters, Paging>, datasourceName: string): SearchTypeClass<Context, Filters, Paging> {
    const result = searchTcs[datasourceName];
    if (!result) reportError('s/w', `No search type class for datasource ${datasourceName}. Legal values are ${Object.keys(searchTcs).sort().join(', ')}`);
    return result as SearchTypeClass<Context, Filters, Paging>;
}

export type SearchUsingSearcherContext<Context, Filters> = DebugContext & {
    searchers: DatasourceNameToSearcher<any>
    tcs: DatasourceNameToSearchTypeClass<Context, Filters, any>

}

export type Searcher<Context extends DebugContext, TC extends SearchTypeClass<Context, Filters, Paging>, Filters, Data, Paging> = (context: Context, tc: TC, from: QueryDatasourceAndPaging<Filters, Paging>) => Promise<ErrorsOr<SearchResult<Data, Paging>>>
export type DatasourceNameToSearcher<Context extends DebugContext> = NameAnd<Searcher<Context, any, any, any, any>>

export function findSearcher<Context extends SearchUsingSearcherContext<Context, Filters>, TC extends SearchTypeClass<Context, Filters, Paging>, Filters, Data, Paging>(context: Context, reportError: ReportError, datasourceName: string, searcherType: string): Searcher<Context, TC, Filters, Data, Paging> {
    const searchers = context.searchers;
    const searcher = searchers[searcherType]
    if (!searcher) reportError('s/w', `Cannot find searcher for ${datasourceName}. Type is ${searcherType}. Legal values are ${Object.keys(searchers).sort()}`)
    return searcher
}


export async function searchUsingSearcher<Context extends SearchUsingSearcherContext<Context, Filters>, Filters, Data, Paging>(context: Context, reportError: ReportError, from: QueryDatasourceAndPaging<Filters, Paging>): Promise<ErrorsOr<SearchResult<Data, Paging>>> {
    let datasourceName = from.datasourceName;
    const {tcs, debug} = context
    const searchTc = findSearchTc<Context, Filters, Paging>(reportError, tcs, from.datasourceName)
    const searcher = findSearcher<Context, any, Filters, Data, Paging>(context, reportError, datasourceName, searchTc.type)
    const paging = from.paging ? from.paging : await searchTc.page1(context, from)
    const fromWithPaging = {...from, paging};
    return searcher(context, searchTc, fromWithPaging)
}


export async function scrollOneDataSource<Context extends SearchUsingSearcherContext<Context, Filters>, Filters, Data, Paging>(context: Context, reportError: ReportError, existing: SearchResult<Data, Paging>, from: QueryDatasourceAndPaging<Filters, Paging>): Promise<ErrorsOr<SearchResult<Data, Paging>>> {
    const {datasourceName} = from
    const rawResult = await searchUsingSearcher<Context, Filters, Data, Paging>(context, reportError, from)
    return mapErrorsOr(rawResult, raw => ({...raw, count: from.count, datasourceName, data: [...existing.data, ...raw.data]}));
}


