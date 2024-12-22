import React from "react";
import {TranslatedLabel, TranslatedMultiSelect} from "@enterprise_search/translation";
import {DisplayFilterProps} from "@enterprise_search/react_filters_plugin";
import {useOneFilter} from "@enterprise_search/react_search_state";
import {DataSourceFilterData, dataSourceFilterName, DatasourceFilters} from "./react.datasource.filter";
import {lensBuilder} from "@enterprise_search/optics";
import {makeGetterSetter} from "@enterprise_search/optics";
import {toArray} from "@enterprise_search/recoil_utils";

const selectDataSourcesTranslationKey = 'data-source-filter.select-data-sources';
const noDataSourcesTranslationKey = 'data-source-filter.no-data-sources';


export function SimpleDataSourceFilter({id = `datasource-filter-${Math.random().toString(36).slice(2, 9)}`}: DisplayFilterProps<DataSourceFilterData>) {
    const [data, setData] = useOneFilter<DatasourceFilters, 'datasources'>(dataSourceFilterName);
    const selectedNamesOps = makeGetterSetter(data, setData, lensBuilder<DataSourceFilterData>().focusOn('selectedNames'))

    return (
        <div className="data-source-filter" id={`${id}-filter-outer`}>
            <TranslatedLabel translationKey={selectDataSourcesTranslationKey} htmlFor={id}/>
            <TranslatedMultiSelect
                className="datasource-filter-dropdown"
                id={id}
                allowedNames={toArray(data?.allowedNames)}
                noItemsKey={noDataSourcesTranslationKey}
                stateOps={selectedNamesOps}
            />
        </div>
    );
}
