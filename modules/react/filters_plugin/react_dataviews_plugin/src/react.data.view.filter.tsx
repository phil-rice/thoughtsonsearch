import {DisplayFilter, ReactFiltersPlugin} from "@enterprise_search/react_filters_plugin";
import {SimpleDataViewFilterDisplay} from "./simple.data.view.filter.display";

import {toArray} from "@laoban/utils";
import {DebugLog} from "@enterprise_search/recoil_utils";

export const dataViewFilterName = 'dataviews';


export type DataViewFilterData = {
    //It is annoying we need this to communicate with the url, but I've not found a cleaner way yet
    selected: string
    allowedNames: string[]
    selectedNames?: string[] //if not present then all are selected
}

export type DataViewFilters = {
    [dataViewFilterName]: DataViewFilterData
}

export const dataViewFilter =
    <Filters extends DataViewFilters, >(Display: DisplayFilter<DataViewFilterData>): ReactFiltersPlugin<DataViewFilters, 'dataviews'> => ({
        plugin: 'filter',
        type: 'dataviews',
        DefaultDisplay: Display,
        PurposeToDisplay: {},//happy with defaults
        addToUrl: (debug: DebugLog, sp: URLSearchParams, data: DataViewFilterData,) => {
            const selected = toArray(data?.selectedNames).join(' ')
            debug('dataViewFilter addToUrl', 'selected=', selected, sp.toString())
            if (selected) sp.set('selected', selected); else sp.delete('selected')
            debug('dataViewFilter addToUrl - after updating sp', sp.toString())
        },
        fromUrl: (debug: DebugLog, windowUrlData, def) => {
            const searchParams = windowUrlData.url.searchParams
            const rawSelectedNames = searchParams.get('selected')
            debug('dataViewFilter fromUrl', 'selected=', rawSelectedNames)
            const rawSelected = rawSelectedNames?.split(' ') || [];
            const allowed = toArray(def?.allowedNames)
            debug('dataViewFilter fromUrl', 'allowed=', allowed)
            const selectedNames = rawSelected.filter(s => allowed.includes(s))
            return rawSelectedNames ? {...def, selectedNames} : def
        }
    })

export const simpleDataViewFilter = dataViewFilter(SimpleDataViewFilterDisplay);
