import {DatasourceNameToSearcher, DatasourceNameToSearchTypeClass} from "./search.typeclass";
import {SearchParser} from "./search.parser";
import {DebugContext} from "@enterprise_search/debug";


export type SearchContext<Context extends SearchContext<Context>> = DebugContext & {
    tcs: DatasourceNameToSearchTypeClass<Context, any>
    searchers: DatasourceNameToSearcher<Context>
    queryParser: SearchParser
}


