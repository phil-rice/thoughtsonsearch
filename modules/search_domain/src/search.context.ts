import {DatasourceNameToSearchTypeClass} from "./search.typeclass";
import {SearchState, SearchQuery} from "./search.domain";
import {ServiceCaller} from "@enterprise_search/service_caller";
import {SearchParser} from "./search.parser";



export type SearchContext = {
    tcs: DatasourceNameToSearchTypeClass<SearchContext>
    queryParser: SearchParser
    serviceCaller: ServiceCaller<any, any> // we don't know req and res. But we know it's internally consistant and we have ways of getting what we want out of the caller
}

