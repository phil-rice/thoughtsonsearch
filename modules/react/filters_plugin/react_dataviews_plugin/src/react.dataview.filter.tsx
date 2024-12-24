import {DisplayFilter, ReactFiltersPlugin} from "@enterprise_search/react_filters_plugin";
import {SimpleDataViewFilterDisplay} from "./simpleDataViewFilterDisplay";

export const dataViewFilterName = 'dataviews';


export type DataViewFilterData = {
    allowedNames: string[]
    selectedNames?: string[]
}

export type DataViewFilters = {
    [dataViewFilterName]: DataViewFilterData
}

export const dataViewFilter =
    <Filters extends DataViewFilters, >(Display: DisplayFilter<DataViewFilterData>): ReactFiltersPlugin<DataViewFilters, 'dataviews'> => ({
        plugin: 'filter',
        type: 'dataviews',
        DefaultDisplay: Display,
        PurposeToDisplay: {}//happy with defaults
    })

export const simpleDataViewFilter=dataViewFilter(SimpleDataViewFilterDisplay);
