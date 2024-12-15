import {DatasourceNameToSearcher, DatasourceNameToSearchTypeClass} from "./search.typeclass";
import {SearchParser} from "./search.parser";
import {DebugContext} from "@enterprise_search/debug";


export type SearchContext = DebugContext & {
    tcs: DatasourceNameToSearchTypeClass<SearchContext>
    searchers: DatasourceNameToSearcher<SearchContext>
    queryParser: SearchParser
}


