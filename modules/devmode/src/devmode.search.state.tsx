import {useSearchState} from "@enterprise_search/react_search_state";
import React from "react";
import {SearchType, searchTypes} from "@enterprise_search/search_state";
import {makeSimpleNavBar, NavBar} from "@enterprise_search/navbar";
import {GetterSetter} from "@enterprise_search/react_utils";
import {useRenderers} from "@enterprise_search/renderers";

const SearchTypeNavBar: NavBar = makeSimpleNavBar('dev mode search type', searchTypes)

export function DevModeSearchState<Filters, >() {
    const selectedOps = React.useState<SearchType | null>(null)
    const [selected] = selectedOps
    const [searchState] = useSearchState<Filters>()
    const {Json} = useRenderers()
    const value = selected ? searchState.searches[selected] : searchState

    return <div className='dev-mode-search-state'>
        <SearchTypeNavBar selectedOps={selectedOps as GetterSetter<string>}/>
        <Json id={'dev-mode-search-state'} value={JSON.stringify(value, null, 2)}/>
    </div>
}
