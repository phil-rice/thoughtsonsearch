import {makeSovereignStatePlugin, useSelectedSovereign} from "@enterprise_search/sovereign";
import {useSearchBar} from "@enterprise_search/search_bar";
import {useDisplayAllFilters} from "@enterprise_search/react_filters_plugin";
import React, {useEffect} from "react";
import {useGuiFilters, useGuiSearchQuery} from "@enterprise_search/search_gui_state";
import {SearchResults} from "./display.search.results";
import {DataViewNavBar} from "@enterprise_search/data_views";
import {keywordsFilterName} from "@enterprise_search/react_keywords_filter_plugin";
import {useFiltersByStateType} from "@enterprise_search/react_search_state";
import {useSearchParser} from "@enterprise_search/react_search_parser";
import {dataViewFilterName, DataViewFilters} from "@enterprise_search/react_data_views_filter_plugin";


export function AdvancedSearchSovereignPage<Filters extends DataViewFilters>() {
    const SearchBar = useSearchBar()
    const [mainFilters, setMainFilters] = useFiltersByStateType<Filters>('main')
    const [immediateFilters, setImmediateFilters] = useFiltersByStateType<Filters>('immediate')
    const parser = useSearchParser()
    const filterOps = useGuiFilters()
    const guiFilters: Filters = filterOps[0]
    const [searchQuery]= useGuiSearchQuery()
    const {DisplayAllFilters} = useDisplayAllFilters<Filters>()

    const immediateSearch = (searchQuery: string) => {
        const newGuiFilters = {...guiFilters, [keywordsFilterName]: searchQuery}
        setImmediateFilters(parser(newGuiFilters, immediateFilters))
    }
    const mainSearch = () => {
        const newGuiFilters = {...guiFilters, [keywordsFilterName]: searchQuery}
        setMainFilters(parser(newGuiFilters, mainFilters));
    };
    useEffect(() => {
        mainSearch()
    }, [guiFilters[dataViewFilterName]])

    return <>
        <h1>Advance search</h1>
        <SearchBar immediateSearch={immediateSearch} mainSearch={mainSearch}/>
        <DataViewNavBar/>
        <SearchResults st='main'/>
        <DisplayAllFilters id='filter' filtersOps={filterOps}/>
    </>
}

export const AdvanceSearchPagePlugin = makeSovereignStatePlugin(AdvancedSearchSovereignPage)

