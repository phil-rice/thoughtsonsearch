import {SearchBar, SearchBarProvider} from "@enterprise_search/search_bar";
import {ReactFiltersContextData, ReactFiltersProvider} from "@enterprise_search/react_filters_plugin";
import React from "react";
import {CommonDataSourceDetails, DataSourceDetails, DataSourcePluginProvider, DataSourcePlugins} from "@enterprise_search/react_datasource_plugin";
import {DataPluginProvider, DataPlugins} from "@enterprise_search/react_data/src/react.data";
import {DisplayLogin, LoginComponentsProvider} from "@enterprise_search/react_login_component";
import {DisplaySearchResultsLayout, SearchResultsProvider} from "@enterprise_search/sovereign_search";
import {dataSourceDetailsToDataView, DataViews, DataViewsProvider, NavBarItem} from "@enterprise_search/data_views";
import {emptySearchGuiState, GuiSelectedDataViewProvider, SearchGuiStateProvider} from "@enterprise_search/search_gui_state";
import {DataViewFilters} from "@enterprise_search/react_data_views_filter_plugin";
import {DevModeStateForSearchProvider} from "@enterprise_search/devmode";
import {emptySearchState} from "@enterprise_search/search_state";
import {SearchInfoProviderUsingUseState} from "@enterprise_search/react_search_state";
import {SearchResultsComponents, SearchResultsComponentsProvider} from "@enterprise_search/sovereign_search/src/search.results.components";
import {UrlManagementForSearch} from "./urlManagementForSearch";
import {SearchDropDownComponents, SearchDropDownProvider} from "@enterprise_search/search_dropdown"

export const startStateDebug = 'startState'

/* These all need to have an implementation for the search to work
If you add new components to the search, they should really be here so that
we can easily find them, and have different versions of them for different clients

If for example we choose to move to MUI we can implement this for MUI and the search application should work
 */
export interface SearchImportantComponents<Context, Details extends CommonDataSourceDetails, Filters> {
    reactFiltersContextData: ReactFiltersContextData<Filters>
    dataSourcePlugins: DataSourcePlugins<Filters>
    dataViewDetails: DataSourceDetails<Details>
    dataPlugins: DataPlugins
    SearchBar: SearchBar
    DisplayLogin: DisplayLogin
    NotLoggedIn?: () => React.ReactElement
    DisplaySearchResultsLayout: DisplaySearchResultsLayout
    NavBarItem: NavBarItem
    SearchResultsComponents: SearchResultsComponents
    SearchDropDownComponents: SearchDropDownComponents
}


export type SearchImportantComponentsProviderProps<Context, Details extends CommonDataSourceDetails, Filters> = {
    components: SearchImportantComponents<Context, Details, Filters>

    children: React.ReactNode
}

export type SetupStartStateProps<Filters extends DataViewFilters> = {

    dataViewDetails: DataSourceDetails<CommonDataSourceDetails>
    children: React.ReactNode
}


export function SearchImportantComponentsProvider<Context, Details extends CommonDataSourceDetails, Filters extends DataViewFilters>({components, children}: SearchImportantComponentsProviderProps<Context, Details, Filters>) {
    const {
        SearchBar, dataPlugins, dataSourcePlugins, reactFiltersContextData, DisplayLogin, DisplaySearchResultsLayout,
        NotLoggedIn, NavBarItem, dataViewDetails
    } = components
    const dataViews: DataViews<Details> = dataSourceDetailsToDataView(dataViewDetails, NavBarItem)

    return <SearchInfoProviderUsingUseState allSearchState={emptySearchState}>
        <GuiSelectedDataViewProvider>
            <SearchBarProvider searchBar={SearchBar}>
                <DevModeStateForSearchProvider devModeState={{selected: ''}}>
                    <ReactFiltersProvider reactFilters={reactFiltersContextData}>
                        <DataSourcePluginProvider plugins={dataSourcePlugins}>
                            <DataPluginProvider dataPlugins={dataPlugins}>
                                <LoginComponentsProvider loginComponents={{DisplayLogin: DisplayLogin, NotLoggedIn: NotLoggedIn}}>
                                    <SearchResultsProvider DisplaySearchResultsLayout={DisplaySearchResultsLayout}>
                                        <DataViewsProvider dataViews={dataViews}>
                                            <SearchDropDownProvider searchDropDown={components.SearchDropDownComponents}>
                                                <SearchResultsComponentsProvider searchResultsComponents={components.SearchResultsComponents}>
                                                    <SearchGuiStateProvider searchGuiState={emptySearchGuiState}>
                                                        <UrlManagementForSearch dataViewDetails={dataViewDetails}>{
                                                            children
                                                        }
                                                        </UrlManagementForSearch>
                                                    </SearchGuiStateProvider>
                                                </SearchResultsComponentsProvider>
                                            </SearchDropDownProvider>
                                        </DataViewsProvider>
                                    </SearchResultsProvider>
                                </LoginComponentsProvider>
                            </DataPluginProvider>
                        </DataSourcePluginProvider>
                    </ReactFiltersProvider>
                </DevModeStateForSearchProvider>
            </SearchBarProvider>
        </GuiSelectedDataViewProvider>
    </SearchInfoProviderUsingUseState>
}




