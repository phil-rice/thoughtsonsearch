import {SearchBar, SearchBarProvider} from "@enterprise_search/search_bar";
import {ReactFiltersContextData, ReactFiltersProvider} from "@enterprise_search/react_filters_plugin";

import {LoadingDisplay} from "@enterprise_search/loading";
import React from "react";
import {DataSourcePluginProvider, DataSourcePlugins} from "@enterprise_search/react_datasource_plugin";
import {DataPluginProvider, DataPlugins} from "@enterprise_search/react_data/src/react.data";
import {DisplayLogin, LoginProvider} from "@enterprise_search/react_login_component";
import {DisplaySearchResultsLayout, SearchResultsProvider} from "@enterprise_search/sovereign_search";


export type SearchImportantContext = {}

/* These all need to have an implementation for the search to work
If you add new components to the search, they should really be here so that
we can easily find them, and have different versions of them for different clients

If for example we choose to move to MUI we can implement this for MUI and the search application should work
 */
export interface SearchImportantComponents<Context, Filters> {
    reactFiltersContextData: ReactFiltersContextData<Filters>
    dataSourcePlugins: DataSourcePlugins<Filters>
    dataPlugins: DataPlugins
    SearchBar: SearchBar
    DisplayLogin: DisplayLogin
    NotLoggedIn?: () => React.ReactElement
    /*If present will be displayed when loading. There is a default but it's not very pretty*/
    LoadingDisplay?: LoadingDisplay
    DisplaySearchResultsLayout: DisplaySearchResultsLayout
}


export type SearchImportantComponentsProviderProps<Context, Filters> = {
    components: SearchImportantComponents<Context, Filters>
    children: React.ReactNode
}

export function SearchImportantComponentsProvider<Context, Filters>({components, children}: SearchImportantComponentsProviderProps<Context, Filters>) {
    const {
        SearchBar, dataPlugins, dataSourcePlugins, reactFiltersContextData, LoadingDisplay, DisplayLogin, DisplaySearchResultsLayout,
        NotLoggedIn
    } = components
    return <SearchBarProvider searchBar={SearchBar}>
        <ReactFiltersProvider reactFilters={reactFiltersContextData}>
            <DataSourcePluginProvider plugins={dataSourcePlugins}>
                <DataPluginProvider dataPlugins={dataPlugins}>
                    <LoginProvider loginComponents={{DisplayLogin: DisplayLogin, NotLoggedIn: NotLoggedIn}}>
                        <SearchResultsProvider DisplaySearchResultsLayout={DisplaySearchResultsLayout}>
                            {children}
                        </SearchResultsProvider>
                    </LoginProvider>
                </DataPluginProvider>
            </DataSourcePluginProvider>
        </ReactFiltersProvider>
    </SearchBarProvider>
}




