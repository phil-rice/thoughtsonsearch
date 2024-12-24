import {makeSovereignStatePlugin, useSelectedSovereign} from "@enterprise_search/sovereign";
import {useSearchBar} from "@enterprise_search/search_bar";
import React from "react";
import {useGuiFilters} from "@enterprise_search/search_gui_state";


export function InitialSearchSovereignPage<Filters>() {
    const SearchBar = useSearchBar()
    const [selected, setSelected] = useSelectedSovereign()

    const filterOps = useGuiFilters()
    return <>
        <h1>Initial search</h1>
        <SearchBar onSearch={() => {
            setSelected('advancedSearch')
        }}/>
    </>
}

export const InitialSovereignPagePlugin = makeSovereignStatePlugin(InitialSearchSovereignPage)

