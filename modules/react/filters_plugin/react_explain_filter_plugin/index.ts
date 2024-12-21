import {ReactFiltersPlugin} from "@enterprise_search/react_filters_plugin";

export type ExplainData = undefined | {
    id: string
}
export type ExplainFilters = {
    explain: ExplainData
}

export type ExplainContext
export type FilterExplainData = ReactFiltersPlugin<any, any>