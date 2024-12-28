import {GetterSetter, makeContextForState, makeGetterSetter, makeUseStateChild} from "@enterprise_search/react_utils";
import {useMemo} from "react";
import {lensBuilder} from "@enterprise_search/optics";
import {makeRoutingSegmentContextFor} from "@enterprise_search/routing";

export type SearchGuiData<Filters> = {
    searchQuery: string
    filters: Filters
}
export const emptySearchGuiState = {searchQuery: '', filters: {}}

export const {Provider: SearchGuiStateProvider, use: useSearchGuiState} = makeContextForState<SearchGuiData<any>, 'searchGuiState'>('searchGuiState')
export const useGuiSearchQuery = makeUseStateChild(useSearchGuiState, id => id.focusOn('searchQuery'))
export const useGuiFilters = makeUseStateChild(useSearchGuiState, id => id.focusOn('filters'))

export const {use: useGuiSelectedDataView, Provider: GuiSelectedDataViewProvider} = makeRoutingSegmentContextFor('routing1', 1)

export function useGuiFilter<Filters, FilterName extends keyof Filters>(filterName: FilterName): GetterSetter<Filters[FilterName]> {
    const [value, setValue] = useGuiFilters(); // This is `useField()` behind the scenes
    return useMemo(() => {
        return makeGetterSetter<Filters, Filters[FilterName]>(value, setValue, lensBuilder<Filters>().focusOn(filterName))
    }, [value, setValue, id => id.focusOn(filterName)]); // lens might be stable or not, depends on usage
}

