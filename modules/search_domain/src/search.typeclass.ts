import {QueryDatasourceAndPaging, SearchQuery, SearchResult} from "./search.domain";

import {ErrorsOr, mapErrorsOr} from "@enterprise_search/errors";
import {DebugContext} from "@enterprise_search/debug";
import {NameAnd} from "@enterprise_search/recoil_utils";

//We will have several of these. They are very high level
//For example 'searches by means of an api', 'builds up a query using gen ai and then calls an api', 'does some rag, does ai, calls an api with query from ai'
export type SearchTypeClass<Context, Paging> = {
    type: string
    page1: (context: Context, query: QueryDatasourceAndPaging<Paging>) => Promise<Paging>
}
export type DatasourceNameToSearchTypeClass<Context, Paging> = NameAnd<SearchTypeClass<Context, Paging>>

export function findSearchTc<Context, Paging>(searchTcs: DatasourceNameToSearchTypeClass<Context, Paging>, datasourceName: string): SearchTypeClass<Context, Paging> {
    const result = searchTcs[datasourceName];
    if (!result) throw new Error(`No search type class for datasource ${datasourceName}. Legal values are ${Object.keys(searchTcs).sort().join(', ')}`);
    return result as SearchTypeClass<Context, Paging>;
}

export type SearchUsingSearcherContext<Context> = DebugContext & {
    searchers: DatasourceNameToSearcher<any>
    tcs: DatasourceNameToSearchTypeClass<Context, any>

}

export type Searcher<Context extends DebugContext, TC extends SearchTypeClass<Context, Paging>, Data, Paging> = (context: Context, tc: TC, from: QueryDatasourceAndPaging<Paging>) => Promise<ErrorsOr<SearchResult<Data, Paging>>>
export type DatasourceNameToSearcher<Context> = NameAnd<Searcher<Context, any, any, any>>

export function findSearcher<Context extends SearchUsingSearcherContext<Context>, TC extends SearchTypeClass<Context, Paging>, Data, Paging>(context: Context, datasourceName: string, searcherType: string): Searcher<Context, TC, Data, Paging> {
    const searchers = context.searchers;
    const searcher = searchers[searcherType]
    if (!searcher) throw Error(`Cannot find searcher for ${datasourceName}. Type is ${searcherType}. Legal values are ${Object.keys(searchers).sort()}`)
    return searcher
}


export async function searchUsingSearcher<Context extends SearchUsingSearcherContext<Context>, Data, Paging>(context: Context, from: QueryDatasourceAndPaging<Paging>): Promise<ErrorsOr<SearchResult<Data, Paging>>> {
    let datasourceName = from.datasourceName;
    const {searchers, tcs, debug} = context
    const searchTc = findSearchTc<Context, Paging>(tcs, from.datasourceName)
    const paging = from.paging ? from.paging : await searchTc.page1(context, from)
    const searcher = findSearcher<Context, any, Data, Paging>(context, datasourceName, searchTc.type)
    return searcher(context, searchTc, from)
}


export async function scrollOneDataSource<Context extends SearchUsingSearcherContext<Context>, Data, Paging>(context: Context, existing: SearchResult<Data, Paging>, from: QueryDatasourceAndPaging<Paging>): Promise<ErrorsOr<SearchResult<Data, Paging>>> {
    const {query, datasourceName} = from
    const rawResult = await searchUsingSearcher<Context, Data, Paging>(context, from)
    return mapErrorsOr(rawResult, raw => ({...raw, count: query.count, datasourceName, data: [...existing.data, ...raw.data]}));
}


