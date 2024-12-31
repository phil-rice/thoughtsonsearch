import {useSearchState} from "@enterprise_search/react_search_state";
import React from "react";
import {SearchType, searchTypes} from "@enterprise_search/search_state";
import {makeSimpleNavBar, NavBar} from "@enterprise_search/navbar";
import {GetterSetter} from "@enterprise_search/react_utils";

const SearchTypeNavBar: NavBar = makeSimpleNavBar('dev mode search type', searchTypes)

export function DevModeSearchState<Filters, >() {
    const selectedOps = React.useState<SearchType | null>(null)
    const [selected] = selectedOps
    const [searchState] = useSearchState<Filters>()

    function Body() {
        if (!selected) return <pre>{JSON.stringify(searchState, null, 2)}</pre>
        return <pre>{JSON.stringify(searchState.searches[selected], null, 2)}</pre>
    }

    return <div className='dev-mode-search-state'>
        <SearchTypeNavBar selectedOps={selectedOps as GetterSetter<string>}/>
        <Body/>
    </div>
}
