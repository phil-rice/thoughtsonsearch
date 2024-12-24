import {makeContextForState, makeUseStateChild} from "@enterprise_search/react_utils";

export type SearchGuiData<Filters> = {
    searchQuery: string
    filters: Filters
}
export const emptySearchGuiState = {searchQuery: '', filters: {} as any}

export const {Provider: SearchGuiStateProvider, use: useSearchGuiState} = makeContextForState<SearchGuiData<any>,'searchGuiState'>('searchGuiState')
export const useGuiSearchQuery = makeUseStateChild(useSearchGuiState, id => id.focusOn('searchQuery'))
export const useGuiFilters = makeUseStateChild(useSearchGuiState, id => id.focusOn('filters'))
