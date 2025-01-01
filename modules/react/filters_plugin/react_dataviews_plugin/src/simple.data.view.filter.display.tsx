import React from "react";
import {TranslatedLabel, TranslatedMultiSelect} from "@enterprise_search/translation";
import {DisplayFilterProps} from "@enterprise_search/react_filters_plugin";

import {DataViewFilterData} from "./react.data.view.filter";
import {lensBuilder} from "@enterprise_search/optics";
import {makeGetterSetter} from "@enterprise_search/react_utils";

const selectDataViewsTranslationKey = 'filter.data-view.select-data-sources';
const noDataViewTranslationKey = 'filter.data-view.no-data-sources';


export function SimpleDataViewFilterDisplay({filterOps, id}: DisplayFilterProps<DataViewFilterData>) {
    const [data, setData] = filterOps
    const selectedNamesOps = makeGetterSetter(data, setData, lensBuilder<DataViewFilterData>().focusOn('selectedNames'))
    const allowedNames = data?.allowedNames||[];
    return (
        <div className="data-view-filter" id={id ? `${id}-filter-outer` : undefined}>
            <TranslatedLabel translationKey={selectDataViewsTranslationKey} htmlFor={id}/>
            <TranslatedMultiSelect
                className="datasource-filter-dropdown"
                purpose="Filters display"
                id={id}
                allowedNames={allowedNames}
                noItemsKey={noDataViewTranslationKey}
                stateOps={selectedNamesOps}
            />
        </div>
    );
}
