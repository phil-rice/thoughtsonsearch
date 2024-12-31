import {makeSovereignStatePlugin,useSelectedSovereign} from "@enterprise_search/sovereign";
import React from "react";
import {CommonSearchSovereignPage} from "./common.search.sovereign.page";

export function InitialSearchSovereignPage<Filters>() {
    const [selected, setSelected] = useSelectedSovereign()
    return <CommonSearchSovereignPage title={'search.advance.title'} onMainSearch={() => {setSelected('advancedSearch');}}/>
}

export const InitialSovereignPagePlugin = makeSovereignStatePlugin(InitialSearchSovereignPage)

