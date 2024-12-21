import {DisplayFilter, filtersDisplayPurpose, ReactFiltersPlugin} from "@enterprise_search/react_filters_plugin/src/react.filters.plugin";
import {useOneFilter} from "@enterprise_search/react_search_state";
import React from "react";

export const keywordsFilterName = 'keywords'

export type KeywordsFilter = {
    [keywordsFilterName]: string
}


export const keywordsFilterPlugin = (Display: DisplayFilter<string>): ReactFiltersPlugin<any, KeywordsFilter, 'keywords'> => ({
    plugin: 'filter',
    type: keywordsFilterName,
    DefaultDisplay: SimpleKeywordsDisplay,
    PurposeToDisplay: {[filtersDisplayPurpose]: null}
})
export const simpleKeywordsFilterPlugin = keywordsFilterPlugin(SimpleKeywordsDisplay)

export function SimpleKeywordsDisplay() {
    const [filter] = useOneFilter<KeywordsFilter, 'keywords'>(keywordsFilterName)
    return <div>{filter}</div>
}