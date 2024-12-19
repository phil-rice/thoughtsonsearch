
import {createContext, useContext} from "react";
import {KeywordsFilter, keywordsFilterName} from "@enterprise_search/react_keywords_filter";

export type SearchParser<Filters extends KeywordsFilter> = (query: string, from: Filters) => Filters

export function simpleSearchParser<Filters extends KeywordsFilter>(query: string, from: Filters): Filters {
    return {...from, [keywordsFilterName]: query}
}

export const SearchParserContext = createContext<SearchParser<any>>(simpleSearchParser)

export function SearchParserProvider<Filters extends KeywordsFilter>({children, parser}: { children: React.ReactNode, parser: SearchParser<Filters> }) {
    return <SearchParserContext.Provider value={parser}>{children}</SearchParserContext.Provider>
}

export function useSearchParser<Filters extends KeywordsFilter>(): SearchParser<Filters> {
    return useContext(SearchParserContext)
}

