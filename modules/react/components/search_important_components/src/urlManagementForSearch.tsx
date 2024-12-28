import {dataViewFilterName, DataViewFilters} from "@enterprise_search/react_data_views_filter_plugin";
import {SearchGuiData, useGuiSelectedDataView, useSearchGuiState} from "@enterprise_search/search_gui_state";
import {DebugLog, useDebug} from "@enterprise_search/react_utils";
import {ReactFiltersPlugin, ReactFiltersPlugins, useReactFilters} from "@enterprise_search/react_filters_plugin";
import React, {useEffect} from "react";
import {uniqueStrings} from "@enterprise_search/recoil_utils/src/arrays";
import {SetupStartStateProps, startStateDebug} from "./search.important.components";
import {CommonDataSourceDetails, DataSourceDetails} from "@enterprise_search/react_datasource_plugin";
import {useSelectedSovereign} from "@enterprise_search/sovereign";

function calculateStartStateFromUrl<Filters>(debug: DebugLog, dataViewDetails: DataSourceDetails<CommonDataSourceDetails>, filterPlugins: ReactFiltersPlugins<any>, state: SearchGuiData<any>, selectedDataView: string) {
    const url = new URL(window.location.href)
    const dataViewDetail = dataViewDetails[selectedDataView];
    if (!dataViewDetail) throw new Error(`Cannot find dataViewDetail for ${selectedDataView}. Legal values are ${Object.keys(dataViewDetails).sort()}`)
    const startState: SearchGuiData<Filters> = {
        ...state,
        filters: {
            [dataViewFilterName]: {allowedNames: uniqueStrings(dataViewDetail.flatMap(x => x.names)), selectedNames: []}
        } as Filters,
    }

    for (const [name, plugin] of Object.entries(filterPlugins)) {
        const filterPlugin: ReactFiltersPlugin<Filters, any> = plugin as unknown as any
        debug('loading', 'filter', name, filterPlugin.fromUrl)
        if (filterPlugin.fromUrl) {
            const newFilter = filterPlugin.fromUrl(debug, url.searchParams, startState.filters[name]);
            debug('newFilterFor', name, newFilter)
            startState.filters[name] = newFilter
        }
    }
    return startState;
}

export function UrlManagementForSearch<Filters extends DataViewFilters>({dataViewDetails, children}: SetupStartStateProps<Filters>) {
    const [selected] = useSelectedSovereign()
    const [state, setState] = useSearchGuiState()
    const [selectedDataView] = useGuiSelectedDataView()
    const debug = useDebug(startStateDebug)
    const filterPlugins = useReactFilters().plugins
    useEffect(() => {
        debug('Calculating start state from url')
        setState(calculateStartStateFromUrl(debug, dataViewDetails, filterPlugins, state, selectedDataView))
    }, []);
    useEffect(() => {
        const url = new URL(window.location.href)
        // we can't use the state when changing view because it's not updated yet. At load time we use the selectedDataView
        //and it's horribly complex... not sure how to clean this up
        const actualSelectedDataView = state.filters[dataViewFilterName]?.selected || selectedDataView
        url.pathname = `/${selected}/${actualSelectedDataView}`
        for (const [name, plugin] of Object.entries(filterPlugins)) {
            const filterPlugin: ReactFiltersPlugin<Filters, any> = plugin as unknown as any
            debug('updating history details for filter', name, state.filters[name], 'plugin defined', !!filterPlugin.addToUrl)
            if (filterPlugin.addToUrl) {
                filterPlugin.addToUrl(debug, url.searchParams, state.filters[name]);
            }
        }
        debug('Changing history to', url.toString())
        window.history.replaceState({}, '', url);
    }, [state.filters, selected])
    return <>{children}</>
}