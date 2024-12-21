import {SearchBar, SearchBarProvider, SimpleSearchBar} from "@enterprise_search/search_bar";
import {DisplayFilter, ReactFiltersContextData, ReactFiltersPlugins, ReactFiltersProvider} from "@enterprise_search/react_filters_plugin";

import {LoadingDisplay} from "@enterprise_search/loading";
import {MustBeLoggedInDisplay} from "modules/react/authentication/react_login_component/src/authenticate";
import React, {createContext} from "react";
import {SimpleKeywordsDisplay} from "@enterprise_search/react_keywords_filter_plugin";
import {SimpleTimeDisplay} from "@enterprise_search/react_time_filter_plugin";
import {DataSourcePluginProvider, DataSourcePlugins} from "@enterprise_search/react_datasource_plugin";
import {DataPlugin, DataPluginProvider, DataPlugins} from "@enterprise_search/react_data/src/react.data";
import {SearchResultsPluginProvider, SearchResultsPlugins} from "@enterprise_search/search_results_plugin";


export type SearchImportantContext = {}

/* These all need to have an implementation for the search to work
If you add new components to the search, they should really be here so that
we can easily find them, and have different versions of them for different clients

If for example we choose to move to MUI we can implement this for MUI and the search application should work
 */
export interface SearchImportantComponents<Context, Filters> {
    searchResultsPlugins: SearchResultsPlugins
    filterPlugins: ReactFiltersContextData<Context, Filters>
    dataSourcePlugins: DataSourcePlugins<Filters>
    dataPlugins: DataPlugins
    SearchBar: SearchBar

    /*If present will be displayed when loading. There is a default but it's not very pretty*/
    LoadingDisplay?: LoadingDisplay
}


export type SearchImportantComponentsProviderProps<Context, Filters> = {
    components: SearchImportantComponents<Context, Filters>
    children: React.ReactNode
}

export function SearchImportantComponentsProvider<Context, Filters>({components, children}: SearchImportantComponentsProviderProps<Context, Filters>) {
    const {SearchBar, dataPlugins, dataSourcePlugins, searchResultsPlugins, filterPlugins, LoadingDisplay} = components

    return <SearchBarProvider SearchBar={SearchBar}>
        <ReactFiltersProvider value={filterPlugins}>
            <SearchResultsPluginProvider plugins={searchResultsPlugins}>
                <DataSourcePluginProvider plugins={dataSourcePlugins}>
                    <DataPluginProvider ops={dataPlugins}>
                        {children}
                    </DataPluginProvider>
                </DataSourcePluginProvider>
            </SearchResultsPluginProvider>
        </ReactFiltersProvider>
    </SearchBarProvider>
}




