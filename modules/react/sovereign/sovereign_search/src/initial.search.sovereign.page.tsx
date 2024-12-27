import {makeSovereignStatePlugin, useSelectedSovereign} from "@enterprise_search/sovereign";
import {useSearchBar} from "@enterprise_search/search_bar";
import React from "react";
import {useGuiFilters, useGuiSearchQuery} from "@enterprise_search/search_gui_state";
import {keywordsFilterName} from "@enterprise_search/react_keywords_filter_plugin";
import {useFiltersByStateType} from "@enterprise_search/react_search_state";
import {useSearchParser} from "@enterprise_search/react_search_parser";

export function InitialSearchSovereignPage<Filters>() {
    const SearchBar = useSearchBar()
    const [selected, setSelected] = useSelectedSovereign()
    const [mainFilters, setMainFilters] = useFiltersByStateType<Filters>('main')
    const [immediateFilters, setImmediateFilters] = useFiltersByStateType<Filters>('immediate')
    const parser = useSearchParser()
    const [guiFilters] = useGuiFilters()
    const [searchQuery] = useGuiSearchQuery()

    const immediateSearch = (searchQuery: string) => {
        const newGuiFilters = {...guiFilters, [keywordsFilterName]: searchQuery}
        setImmediateFilters(parser(newGuiFilters, immediateFilters))
    }
    const mainSearch = () => {
        const newGuiFilters = {...guiFilters, [keywordsFilterName]: searchQuery}
        setMainFilters(parser(newGuiFilters, mainFilters));
        setSelected('advancedSearch')
    };

    return <>
        <h1>Initial search</h1>
        <SearchBar immediateSearch={immediateSearch} mainSearch={mainSearch}/>
    </>
}

export const InitialSovereignPagePlugin = makeSovereignStatePlugin(InitialSearchSovereignPage)

