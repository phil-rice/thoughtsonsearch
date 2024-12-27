import {DisplayFilter, ReactFiltersPlugin} from "@enterprise_search/react_filters_plugin";
import {SimpleDataViewFilterDisplay} from "./simpleDataViewFilterDisplay";

import {toArray} from "@laoban/utils";
import {DebugLog} from "@enterprise_search/react_utils";

export const dataViewFilterName = 'dataviews';


export type DataViewFilterData = {
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
            sp.set('selected', selected)
        },
        fromUrl: (debug: DebugLog, searchParams, def) => {
            const selected = searchParams.get('selected')
            debug('dataViewFilter fromUrl', 'selected=', selected)
            return selected ? {...def, selectedNames: selected.split(' ')} : def
        }
    })

export const simpleDataViewFilter = dataViewFilter(SimpleDataViewFilterDisplay);
