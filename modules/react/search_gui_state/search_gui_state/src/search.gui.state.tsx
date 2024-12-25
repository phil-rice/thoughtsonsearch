import {GetterSetter, makeContextForState, makeGetterSetter, makeUseStateChild} from "@enterprise_search/react_utils";
import React, {useMemo} from "react";
import {lensBuilder} from "@enterprise_search/optics";
import {useSearchState} from "@enterprise_search/react_search_state";

export type SearchGuiData<Filters> = {
    searchQuery: string
    filters: Filters
    selectedDataView: string
}
export const emptySearchGuiState = {searchQuery: '', filters: {} , selectedDataView: 'all'}

export const {Provider: SearchGuiStateProvider, use: useSearchGuiState} = makeContextForState<SearchGuiData<any>, 'searchGuiState'>('searchGuiState')
export const useGuiSearchQuery = makeUseStateChild(useSearchGuiState, id => id.focusOn('searchQuery'))
export const useGuiFilters = makeUseStateChild(useSearchGuiState, id => id.focusOn('filters'))
export const useGuiSelectedDataView = makeUseStateChild(useSearchGuiState, id => id.focusOn('selectedDataView'))

export function useGuiFilter<Filters, FilterName extends keyof Filters>(filterName: FilterName): GetterSetter<Filters[FilterName]> {
    const [value, setValue] = useGuiFilters(); // This is `useField()` behind the scenes
    return useMemo(() => {
        return makeGetterSetter<Filters, Filters[FilterName]>(value, setValue, lensBuilder<Filters>().focusOn(filterName))
    }, [value, setValue, id => id.focusOn(filterName)]); // lens might be stable or not, depends on usage
}

