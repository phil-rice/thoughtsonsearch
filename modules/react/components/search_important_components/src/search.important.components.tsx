import {SearchBar, SearchBarProvider} from "@enterprise_search/search_bar";
import {ReactFiltersContextData, ReactFiltersProvider} from "@enterprise_search/react_filters_plugin";

import {LoadingDisplay} from "@enterprise_search/loading";
import React, {useMemo} from "react";
import {DataSourceAllButton, DataSourceNavBarComponents, DataSourcePluginProvider, DataSourcePlugins} from "@enterprise_search/react_datasource_plugin";
import {DataPluginProvider, DataPlugins} from "@enterprise_search/react_data/src/react.data";
import {SearchResultsPluginProvider, SearchResultsPlugins} from "@enterprise_search/search_results_plugin";
import {DisplayLogin, LoginProvider} from "@enterprise_search/react_login_component";
import {DataSourceNavBarLayout, DataSourceNavBarLayoutProvider} from "@enterprise_search/react_datasource_plugin/src/data.source.nav.bar";


export type SearchImportantContext = {}

/* These all need to have an implementation for the search to work
If you add new components to the search, they should really be here so that
we can easily find them, and have different versions of them for different clients

If for example we choose to move to MUI we can implement this for MUI and the search application should work
 */
export interface SearchImportantComponents<Context, Filters> {
    DataSourceNavBarLayout: DataSourceNavBarLayout
    DataSourceAllButton: DataSourceAllButton
    searchResultsPlugins: SearchResultsPlugins
    reactFiltersContextData: ReactFiltersContextData<Context, Filters>
    dataSourcePlugins: DataSourcePlugins<Filters>
    dataPlugins: DataPlugins
    SearchBar: SearchBar
    displayLogin: DisplayLogin
    NotLoggedIn?: () => React.ReactElement
    /*If present will be displayed when loading. There is a default but it's not very pretty*/
    LoadingDisplay?: LoadingDisplay
}


export type SearchImportantComponentsProviderProps<Context, Filters> = {
    components: SearchImportantComponents<Context, Filters>
    children: React.ReactNode
}

export function SearchImportantComponentsProvider<Context, Filters>({components, children}: SearchImportantComponentsProviderProps<Context, Filters>) {
    const {
        SearchBar, dataPlugins, dataSourcePlugins, searchResultsPlugins, reactFiltersContextData, LoadingDisplay, displayLogin,
        NotLoggedIn, DataSourceNavBarLayout, DataSourceAllButton
    } = components
    const navBarComp: DataSourceNavBarComponents = useMemo(() => ({DataSourceAllButton, DataSourceNavBarLayout}), [DataSourceAllButton, DataSourceNavBarLayoutProvider])
    return <SearchBarProvider SearchBar={SearchBar}>
        <ReactFiltersProvider value={reactFiltersContextData}>
            <SearchResultsPluginProvider plugins={searchResultsPlugins}>
                <DataSourcePluginProvider plugins={dataSourcePlugins}>
                    <DataPluginProvider ops={dataPlugins}>
                        <LoginProvider displayLogin={displayLogin} NotLoggedIn={NotLoggedIn}>
                            <DataSourceNavBarLayoutProvider components={navBarComp}>
                                {children}
                            </DataSourceNavBarLayoutProvider>
                        </LoginProvider>
                    </DataPluginProvider>
                </DataSourcePluginProvider>
            </SearchResultsPluginProvider>
        </ReactFiltersProvider>
    </SearchBarProvider>
}




