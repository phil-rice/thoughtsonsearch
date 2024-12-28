import {useSearchBar} from "@enterprise_search/search_bar";
import React, {ReactNode, useEffect} from "react";
import {useGuiFilters, useGuiSearchQuery} from "@enterprise_search/search_gui_state";
import {keywordsFilterName} from "@enterprise_search/react_keywords_filter_plugin";
import {useFiltersByStateType} from "@enterprise_search/react_search_state";
import {useSearchParser} from "@enterprise_search/react_search_parser";
import {DataViewFilters} from "@enterprise_search/react_data_views_filter_plugin";
import {useSearchDropDownComponents} from "@enterprise_search/search_dropdown";
import {useTranslation} from "@enterprise_search/translation"

export type CommonSearchSovereignPageProps = { title: string, onMainSearch?: () => void, children?: ReactNode }

export function CommonSearchSovereignPage<Filters extends DataViewFilters>({title, children, onMainSearch}: CommonSearchSovereignPageProps) {
    const translate = useTranslation()
    const SearchBar = useSearchBar()
    const {SearchDropDown, SimpleSearchBarAndImmediateSearchLayout} = useSearchDropDownComponents()
    const [mainFilters, setMainFilters] = useFiltersByStateType<Filters>('main')
    const [immediateFilters, setImmediateFilters] = useFiltersByStateType<Filters>('immediate')
    const parser = useSearchParser()
    const filterOps = useGuiFilters()
    const [guiFilters, setGuiFilters] = filterOps
    const [searchQuery] = useGuiSearchQuery()

    const immediateSearch = (searchQuery: string) => {
        const newGuiFilters = {...guiFilters, [keywordsFilterName]: searchQuery}
        setImmediateFilters(parser(newGuiFilters, immediateFilters))
    }
    const mainSearch = () => {
        setGuiFilters(parser({...guiFilters, [keywordsFilterName]: searchQuery}, guiFilters));
        onMainSearch?.()
    };
    useEffect(() => {
        setMainFilters(parser(guiFilters, mainFilters))
    }, [guiFilters])

    return <>
        <h1>{translate(title)}</h1>
        <SimpleSearchBarAndImmediateSearchLayout>
            <SearchBar immediateSearch={immediateSearch} mainSearch={mainSearch}/>
            <SearchDropDown st="immediate"/>
        </SimpleSearchBarAndImmediateSearchLayout>
        {children}
    </>
}


