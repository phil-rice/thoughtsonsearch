import {KeywordsFilter, keywordsFilterName} from "@enterprise_search/react_keywords_filter_plugin";
import {makeContextFor} from "@enterprise_search/react_utils";

export type SearchParser<Filters extends KeywordsFilter> = (guiFilters: Filters, existing: Filters) => Filters

export const simpleSearchParser: SearchParser<any> = <Filters extends KeywordsFilter>(guiFilters: Filters, existing: Filters): Filters => (guiFilters);

export const {use: useSearchParser, context: SearchParserContext, Provider: SearchParserProvider} = makeContextFor('searchParser', simpleSearchParser)

