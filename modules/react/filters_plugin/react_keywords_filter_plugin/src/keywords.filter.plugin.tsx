import {DisplayFilter, DisplayFilterProps, filtersDisplayPurpose, ReactFiltersPlugin} from "@enterprise_search/react_filters_plugin/src/react.filters.plugin";
import React from "react";

export const keywordsFilterName = 'keywords'

export type KeywordsFilter = {
    [keywordsFilterName]: string
}


export const keywordsFilterPlugin = (Display: DisplayFilter<string>): ReactFiltersPlugin<KeywordsFilter, 'keywords'> => ({
    plugin: 'filter',
    type: keywordsFilterName,
    DefaultDisplay: Display,
    PurposeToDisplay: {[filtersDisplayPurpose]: null},
    fromUrl: (debug, windowUrlData, def) => {
        const searchParams = windowUrlData.url.searchParams
        const filter = searchParams.get(keywordsFilterName)
        return filter ? filter : def
    },
    addToUrl: (debug, sp, filter) => {
        debug('keywordsFilter addToUrl', `${keywordsFilterName}=`, filter)
        if (filter) sp.set(keywordsFilterName, filter);
        else sp.delete(keywordsFilterName)
    }
})
export const simpleKeywordsFilterPlugin = keywordsFilterPlugin(SimpleKeywordsDisplay)

/* I am not sure if this will every be used, but it is here for completeness */
export function SimpleKeywordsDisplay({filterOps, id}: DisplayFilterProps<string>) {
    const [filter] = filterOps
    return <div>{filter}</div>
}