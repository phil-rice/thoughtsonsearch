import {KeywordsFilter} from "@enterprise_search/react_keywords_filter_plugin";
import {makeContextFor} from "@enterprise_search/react_utils";
import {simpleSearchParser} from "./simple.search.parser";

export type SearchParser<Filters extends KeywordsFilter> = (guiFilters: Filters, existing: Filters) => Filters

export const {use: useSearchParser, context: SearchParserContext, Provider: SearchParserProvider} = makeContextFor('searchParser', simpleSearchParser)

