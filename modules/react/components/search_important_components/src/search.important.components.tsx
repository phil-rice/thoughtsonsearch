import {SearchBar, SearchBarProvider} from "@enterprise_search/search_bar";
import {ReactFiltersContextData, ReactFiltersProvider} from "@enterprise_search/react_filters_plugin";

import {LoadingDisplay} from "@enterprise_search/loading";
import React, {useEffect} from "react";
import {CommonDataSourceDetails, DataSourceDetails, DataSourcePluginProvider, DataSourcePlugins} from "@enterprise_search/react_datasource_plugin";
import {DataPluginProvider, DataPlugins} from "@enterprise_search/react_data/src/react.data";
import {DisplayLogin, LoginProvider} from "@enterprise_search/react_login_component";
import {DisplaySearchResultsLayout, SearchResultsProvider} from "@enterprise_search/sovereign_search";
import {dataSourceDetailsToDataView, DataViewNavBarLayout, DataViews, DataViewsProvider, NavBarItem} from "@enterprise_search/data_views";
import {emptySearchGuiState, SearchGuiData, SearchGuiStateProvider, useSearchGuiState} from "@enterprise_search/search_gui_state";
import {dataViewFilterName, DataViewFilters} from "@enterprise_search/react_data_views_filter_plugin";
import {uniqueStrings} from "@enterprise_search/recoil_utils/src/arrays";
import {DevModeForSearch, DevModeForSearchProvider} from "@enterprise_search/devmode_gui_state";


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
    /*If present will be displayed when loading. There is a default but it's not very pretty*/
    LoadingDisplay?: LoadingDisplay
    DisplaySearchResultsLayout: DisplaySearchResultsLayout
    DataViewNavBarLayout: DataViewNavBarLayout
    NavBarItem: NavBarItem
}


export type SearchImportantComponentsProviderProps<Context, Details extends CommonDataSourceDetails, Filters> = {
    components: SearchImportantComponents<Context, Details, Filters>
    children: React.ReactNode
}

export type SetupStartStateProps<Filters extends DataViewFilters> = {
    start?: string
    dataViewDetails: DataSourceDetails<CommonDataSourceDetails>
    children: React.ReactNode
}

export function SetUpStartState<Filters extends DataViewFilters>({dataViewDetails, start = 'all', children}: SetupStartStateProps<Filters>) {
    const [state, setState] = useSearchGuiState()
    useEffect(() => {
        const startState: SearchGuiData<Filters> = {
            ...emptySearchGuiState, filters: {
                [dataViewFilterName]: {allowedNames: uniqueStrings(dataViewDetails[start].flatMap(x => x.names)), selectedNames: []}
            } as Filters
        }
        setState(startState)
    }, [])
    return <>{children}</>
}

export function SearchImportantComponentsProvider<Context, Details extends CommonDataSourceDetails, Filters extends DataViewFilters>({components, children}: SearchImportantComponentsProviderProps<Context, Details, Filters>) {
    const {
        SearchBar, dataPlugins, dataSourcePlugins, reactFiltersContextData, LoadingDisplay, DisplayLogin, DisplaySearchResultsLayout,
        NotLoggedIn, NavBarItem, DataViewNavBarLayout, dataViewDetails
    } = components
    const dataViews: DataViews<Details> = dataSourceDetailsToDataView(dataViewDetails, NavBarItem)


    return <SearchBarProvider searchBar={SearchBar}>
        <DevModeForSearchProvider devModeState={{selected: ''}}>
            <ReactFiltersProvider reactFilters={reactFiltersContextData}>
                <DataSourcePluginProvider plugins={dataSourcePlugins}>
                    <DataPluginProvider dataPlugins={dataPlugins}>
                        <LoginProvider loginComponents={{DisplayLogin: DisplayLogin, NotLoggedIn: NotLoggedIn}}>
                            <SearchResultsProvider DisplaySearchResultsLayout={DisplaySearchResultsLayout}>
                                <DataViewsProvider dataViews={dataViews}>

                                    <SearchGuiStateProvider searchGuiState={emptySearchGuiState}>
                                        <SetUpStartState dataViewDetails={dataViewDetails}>{
                                            children
                                        }
                                            <DevModeForSearch/>
                                        </SetUpStartState>
                                    </SearchGuiStateProvider>
                                </DataViewsProvider>
                            </SearchResultsProvider>
                        </LoginProvider>
                    </DataPluginProvider>
                </DataSourcePluginProvider>
            </ReactFiltersProvider>
        </DevModeForSearchProvider>
    </SearchBarProvider>
}




