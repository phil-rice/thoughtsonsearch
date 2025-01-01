import {KeywordsFilter} from "@enterprise_search/react_keywords_filter_plugin";
import {SearchParser} from "./search.parser";

export const simpleSearchParser: SearchParser<any> = <Filters extends KeywordsFilter>(guiFilters: Filters, existing: Filters): Filters =>
    (guiFilters);