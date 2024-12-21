import {SearchBar, SearchBarProvider, SimpleSearchBar} from "@enterprise_search/search_bar";
import {DisplayFilter} from "@enterprise_search/react_filters_plugin";

import {LoadingDisplay} from "@enterprise_search/loading";
import {MustBeLoggedInDisplay} from "@enterprise_search/authentication/src/authenticate";
import React, {createContext} from "react";
import {SimpleKeywordsDisplay} from "@enterprise_search/react_keywords_filter_plugin";
import {SimpleTimeDisplay} from "@enterprise_search/react_time_filter_plugin";


export type SearchImportantContext = {}

/* These all need to have an implementation for the search to work
If you add new components to the search, they should really be here so that
we can easily find them, and have different versions of them for different clients

If for example we choose to move to MUI we can implement this for MUI and the search application should work
 */
export interface SearchImportantComponents {
    SearchBar: SearchBar
    KeywordsFilter: DisplayFilter<string>
    TimeFilter: DisplayFilter<string>
    // ExplainFilter: DisplayFilter<ExplainData>

    /*If present will be displayed when loading. There is a default but it's not very pretty*/
    LoadingDisplay?: LoadingDisplay
}

export const SearchImportantComponentsContext = createContext<SearchImportantComponents | undefined>(undefined);

export type SearchImportantComponentsProviderProps = {
    components: SearchImportantComponents
    children: React.ReactNode
}

export function SearchImportantComponentsProvider({components, children}: SearchImportantComponentsProviderProps) {
    return (
        <SearchImportantComponentsContext.Provider value={components}>
            <SearchBarProvider SearchBar={components.SearchBar}>
                {children}
            </SearchBarProvider>
        </SearchImportantComponentsContext.Provider>
    )
}

export const simpleSearchImportantComponents: SearchImportantComponents = {
    SearchBar: SimpleSearchBar,
    KeywordsFilter: SimpleKeywordsDisplay,
    TimeFilter: SimpleTimeDisplay,
}

export function useSearchImportantComponents(): SearchImportantComponents {
    const components = React.useContext(SearchImportantComponentsContext)
    if (!components) {
        throw new Error("useSearchImportantComponents must be used within a SearchImportantComponentsProvider")
    }
    return components
}