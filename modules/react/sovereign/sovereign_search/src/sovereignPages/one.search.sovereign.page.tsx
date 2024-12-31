import {makeSovereignStatePlugin} from "@enterprise_search/sovereign";
import {useDisplayAllFilters} from "@enterprise_search/react_filters_plugin";
import React from "react";
import {useGuiFilters, useGuiSelectedDataView} from "@enterprise_search/search_gui_state";
import {SearchResults} from "../display.search.results";
import {DataViewNavBar, useDataViews} from "@enterprise_search/data_views";
import {DataViewFilters} from "@enterprise_search/react_data_views_filter_plugin";
import {CommonSearchSovereignPage} from "./common.search.sovereign.page";


export function OneSearchSovereignPage<Filters extends DataViewFilters>() {
    const filterOps = useGuiFilters()
    const {DisplayAllFilters} = useDisplayAllFilters<Filters>()

    return <CommonSearchSovereignPage title={'search.advance.title'}>
        <DataViewNavBar/>
        <SearchResults st='main' showEvenIfEmpty={false}/>
        <DisplayAllFilters id='filter' filtersOps={filterOps}/>
    </CommonSearchSovereignPage>

}

export const OneSearchPagePlugin = makeSovereignStatePlugin(OneSearchSovereignPage)

