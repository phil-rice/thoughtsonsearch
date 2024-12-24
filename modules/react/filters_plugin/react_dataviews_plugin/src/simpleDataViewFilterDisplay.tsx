import React from "react";
import {TranslatedLabel, TranslatedMultiSelect} from "@enterprise_search/translation";
import {DisplayFilterProps} from "@enterprise_search/react_filters_plugin";

import {DataViewFilterData} from "./react.dataview.filter";
import {lensBuilder} from "@enterprise_search/optics";
import {toArray} from "@enterprise_search/recoil_utils";
import {makeGetterSetter} from "@enterprise_search/react_utils";

const selectDataViewsTranslationKey = 'filter.data-view.select-data-sources';
const noDataViewTranslationKey = 'filter.data-view.no-data-sources';


export function SimpleDataViewFilterDisplay({filterOps, id = `datasource-filter-${Math.random().toString(36).slice(2, 9)}`}: DisplayFilterProps<DataViewFilterData>) {
    const [data, setData] = filterOps
    const selectedNamesOps = makeGetterSetter(data, setData, lensBuilder<DataViewFilterData>().focusOn('selectedNames'))

    return (
        <div className="data-view-filter" id={`${id}-filter-outer`}>
            <TranslatedLabel translationKey={selectDataViewsTranslationKey} htmlFor={id}/>
            <TranslatedMultiSelect
                className="datasource-filter-dropdown"
                id={id}
                allowedNames={toArray(data?.allowedNames)}
                noItemsKey={noDataViewTranslationKey}
                stateOps={selectedNamesOps}
            />
        </div>
    );
}
