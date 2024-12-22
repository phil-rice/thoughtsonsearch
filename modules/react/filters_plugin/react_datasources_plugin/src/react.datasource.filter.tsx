import {DisplayFilter, ReactFiltersPlugin} from "@enterprise_search/react_filters_plugin";
import {SimpleDataSourceFilter} from "./simpleDataSourceFilter";

export const dataSourceFilterName = 'datasources';

export type DataSourceFilterData = {
    allowedNames: string[]
    selectedNames?: string[]
}

export type DatasourceFilters = {
    [dataSourceFilterName]: DataSourceFilterData
}

export const dataSourceFilter =
    (Display: DisplayFilter<DataSourceFilterData>): ReactFiltersPlugin<any, DatasourceFilters, 'datasources'> => ({
        plugin: 'filter',
        type: 'datasources',
        DefaultDisplay: Display,
        PurposeToDisplay: {}//happy with defaults
    })

export const simpleDataSourceFilter = dataSourceFilter(SimpleDataSourceFilter);
