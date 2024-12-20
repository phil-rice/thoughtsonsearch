import {filtersDisplayPurpose, ReactFiltersPlugin} from "@enterprise_search/react_filters_plugin/src/react.filters.plugin";
import {useOneFilter} from "@enterprise_search/react_search_state";
import React from "react";

export const keywordsFilterName = 'keywords'

export type KeywordsFilter = {
    [keywordsFilterName]: string
}
export const exampleKeywordsFilterPlugin: ReactFiltersPlugin<KeywordsFilter, 'keywords'> = {
    plugin: 'filter',
    type: keywordsFilterName,
    DefaultDisplay: SimpleKeywordsDisplay,
    PurposeToDisplay: {[filtersDisplayPurpose]: null}
}

export function SimpleKeywordsDisplay() {
    const [filter] = useOneFilter<KeywordsFilter, 'keywords'>(keywordsFilterName)
    return <div>{filter}</div>
}