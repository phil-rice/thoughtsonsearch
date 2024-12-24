import {makeSovereignStatePlugin} from "@enterprise_search/sovereign";
import {useSearchBar} from "@enterprise_search/search_bar";
import {useDisplayAllFilters} from "@enterprise_search/react_filters_plugin";
import React from "react";
import {useGuiFilters} from "@enterprise_search/search_gui_state";
import {SearchResults} from "./display.search.results";


export function AdvancelSearchSovereignPage<Filters>() {
    const SearchBar = useSearchBar()
    const {DisplayAllFilters} = useDisplayAllFilters<Filters>()

    const filterOps = useGuiFilters()
    return <>
        <h1>Advance search</h1>
        <SearchBar onSearch={() => console.log('searching on advance')}/>
        <SearchResults st='main'/>
        <DisplayAllFilters id='filter' filtersOps={filterOps}/>
    </>
}

export const AdvanceSearchPagePlugin = makeSovereignStatePlugin(AdvancelSearchSovereignPage)

