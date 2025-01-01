import {makeSovereignStatePlugin, useSelectedSovereign} from "@enterprise_search/sovereign";
import {useDisplayAllFilters} from "@enterprise_search/react_filters_plugin";
import React from "react";
import {useGuiFilters} from "@enterprise_search/search_gui_state";
import {SearchResults} from "../display.search.results";
import {DataViewFilters} from "@enterprise_search/react_data_views_filter_plugin";
import {CommonSearchSovereignPage} from "./common.search.sovereign.page";


export function OneSearchSovereignPage<Filters extends DataViewFilters>() {
    const filterOps = useGuiFilters()
    const {DisplayAllFilters} = useDisplayAllFilters<Filters>()
    const [selected, setSelected] = useSelectedSovereign()

    return <CommonSearchSovereignPage title={'search.advance.title'} onMainSearch={() => {setSelected('advancedSearch')}}>
        {/*<DataViewNavBar/>*/}
        <SearchResults st='main' showEvenIfEmpty={false}/>
        <DisplayAllFilters id='filter' filtersOps={filterOps}/>
    </CommonSearchSovereignPage>

}

export const OneSearchPagePlugin = makeSovereignStatePlugin(OneSearchSovereignPage)

