import {DataViewFilterData, dataViewFilterName, DataViewFilters} from "@enterprise_search/react_data_views_filter_plugin";
import {SearchGuiData, useGuiSearchQuery, useGuiSelectedDataView, useSearchGuiState} from "@enterprise_search/search_gui_state";
import {DebugLog, useDebug} from "@enterprise_search/react_utils";
import {ReactFiltersPlugin, ReactFiltersPlugins, useReactFilters} from "@enterprise_search/react_filters_plugin";
import React, {useEffect} from "react";
import {uniqueStrings} from "@enterprise_search/recoil_utils/src/arrays";
import {SetupStartStateProps, startStateDebug} from "./search.important.components";
import {CommonDataSourceDetails, DataSourceDetails} from "@enterprise_search/react_datasource_plugin";
import {useSelectedSovereign, useSovereignStatePlugins} from "@enterprise_search/sovereign";
import {useWindowUrlData, WindowUrlData} from "@enterprise_search/routing";
import {KeywordsFilter, keywordsFilterName} from "@enterprise_search/react_keywords_filter_plugin";

function calculateStartStateFromUrl<Filters extends DataViewFilters & KeywordsFilter>(debug: DebugLog, urlData: WindowUrlData, dataViewDetails: DataSourceDetails<CommonDataSourceDetails>, filterPlugins: ReactFiltersPlugins<any>, state: SearchGuiData<any>, rawSelectedDataView: string): SearchGuiData<Filters> {
    const selectedDataView = (rawSelectedDataView in dataViewDetails) ? rawSelectedDataView : Object.keys(dataViewDetails)[0]
    const dataViewDetail = dataViewDetails[selectedDataView];
    if (!dataViewDetail) throw new Error(`Cannot find dataViewDetail for ${selectedDataView}. Legal values are ${Object.keys(dataViewDetails).sort()}`)
    const dataViewFilter: DataViewFilterData = {
        allowedNames: uniqueStrings(dataViewDetail.flatMap(x => x.names)),
        selectedNames: [],
        selected: selectedDataView
    };
    const startState: SearchGuiData<Filters> = {
        ...state,
        filters: {
            [dataViewFilterName]: dataViewFilter,
        } as any,
    }

    for (const [name, plugin] of Object.entries(filterPlugins)) {
        const filterPlugin: ReactFiltersPlugin<Filters, any> = plugin as unknown as any
        debug('loading', 'filter', name, filterPlugin.fromUrl)
        if (filterPlugin.fromUrl) {
            const newFilter = filterPlugin.fromUrl(debug, urlData, startState.filters[name]);
            debug('newFilterFor', name, newFilter)
            startState.filters[name] = newFilter
            debug('newFilterFor sp is now', urlData.url.searchParams.toString())
        }
    }
    const searchQuery = startState.filters.keywords
    return {...startState, searchQuery};
}

export function UrlManagementForSearch<Filters extends DataViewFilters>({dataViewDetails, children}: SetupStartStateProps<Filters>) {
    const [selected] = useSelectedSovereign()
    const sovereignPlugins = useSovereignStatePlugins();
    const [state, setState] = useSearchGuiState()
    const [selectedDataView] = useGuiSelectedDataView()
    const urlData = useWindowUrlData()
    const debug = useDebug(startStateDebug)
    const filterPlugins = useReactFilters().plugins
    const [searchQuery, setSearchQuery] = useGuiSearchQuery()
    useEffect(() => {
        debug('Calculating start state from url')
        const newState = calculateStartStateFromUrl(debug, urlData, dataViewDetails, filterPlugins, state, selectedDataView);
        debug('Calculating start state from url', 'newState', newState)
        setState(newState)
    }, []);
    useEffect(() => {
        const url = new URL(window.location.href)
        // we can't use the state when changing view because it's not updated yet. At load time we use the selectedDataView
        //and it's horribly complex... not sure how to clean this up
        const actualSelectedDataView = state.filters[dataViewFilterName]?.selected || selectedDataView || state.filters[dataViewFilterName]?.selectedDataView
        url.pathname = [selected || Object.keys(sovereignPlugins)[0], actualSelectedDataView].filter(Boolean).join('/');

        for (const [name, plugin] of Object.entries(filterPlugins)) {
            const filterPlugin: ReactFiltersPlugin<Filters, any> = plugin as unknown as any
            debug('updating history details for filter', name, state.filters[name], 'plugin defined', !!filterPlugin.addToUrl)
            if (filterPlugin.addToUrl) {
                filterPlugin.addToUrl(debug, url.searchParams, state.filters[name]);
            }
            debug('updating history details for filter. sp is now', name, url.searchParams.toString())
        }
        debug('Changing history to', url.toString())
        window.history.replaceState({}, '', url);
    }, [state.filters, selected])
    return <>{children}</>
}