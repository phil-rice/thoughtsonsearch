import {makeSovereignStatePlugin} from "@enterprise_search/sovereign";
import {useDisplayAllFilters} from "@enterprise_search/react_filters_plugin";
import React from "react";
import {useGuiFilters} from "@enterprise_search/search_gui_state";
import {SearchResults} from "../display.search.results";
import {DataViewNavBar} from "@enterprise_search/data_views";
import {DataViewFilters} from "@enterprise_search/react_data_views_filter_plugin";
import {CommonSearchSovereignPage} from "./common.search.sovereign.page";


export function AdvancedSearchSovereignPage<Filters extends DataViewFilters>() {
    const filterOps = useGuiFilters()
    const {DisplayAllFilters} = useDisplayAllFilters<Filters>()
    return <CommonSearchSovereignPage title={'search.advance.title'}>
        <DataViewNavBar/>
        <SearchResults st='main'/>
        <DisplayAllFilters id='filter' filtersOps={filterOps}/>
    </CommonSearchSovereignPage>

}

export const AdvanceSearchPagePlugin = makeSovereignStatePlugin(AdvancedSearchSovereignPage)

