import {useSearchBar} from "@enterprise_search/search_bar";
import React, {ReactNode, useEffect} from "react";
import {useGuiFilters, useGuiSearchQuery} from "@enterprise_search/search_gui_state";
import {keywordsFilterName} from "@enterprise_search/react_keywords_filter_plugin";
import {useFiltersByStateType, useSearchResultsByStateType, useSearchState} from "@enterprise_search/react_search_state";
import {useSearchParser} from "@enterprise_search/react_search_parser";
import {DataViewFilters} from "@enterprise_search/react_data_views_filter_plugin";
import {useSearchDropDownComponents} from "@enterprise_search/search_dropdown";
import {useTranslation} from "@enterprise_search/translation"
import {OneSearch} from "@enterprise_search/search_state";
import {setSelection} from "@testing-library/user-event/event/selection/setSelection";
import {useSelectedSovereign} from "@enterprise_search/sovereign";

export type CommonSearchSovereignPageProps = { title: string, onMainSearch?: () => void, children?: ReactNode }

export function CommonSearchSovereignPage<Filters extends DataViewFilters>({title, children, onMainSearch}: CommonSearchSovereignPageProps) {
    const translate = useTranslation()
    const SearchBar = useSearchBar()
    const {SearchDropDown, SearchBarAndImmediateSearchLayout} = useSearchDropDownComponents()
    const [searchState] = useSearchState()
    const [mainFilters, setMainFilters] = useFiltersByStateType<Filters>('main')
    const [mainResults, setMainResults] = useSearchResultsByStateType('main')
    const [immediateFilters, setImmediateFilters] = useFiltersByStateType<Filters>('immediate')
    const [immediateResults, setImmediateResults] = useSearchResultsByStateType('immediate')
    const parser = useSearchParser()
    const filterOps = useGuiFilters()
    const [guiFilters, setGuiFilters] = filterOps
    const [searchQuery] = useGuiSearchQuery()
    const [sovereignPage, setSovereignPage] = useSelectedSovereign()
    const immediateSearch = (searchQuery: string) => {
        const newGuiFilters = {...guiFilters, [keywordsFilterName]: searchQuery}
        setImmediateFilters(parser(newGuiFilters, immediateFilters))
    }

    function cleanImmediateSearchResults() {
        setImmediateResults(old => ({...old, dataSourceToSearchResult: {}}))
    }

    const mainSearch = () => {
        setGuiFilters(parser({...guiFilters, [keywordsFilterName]: searchQuery}, guiFilters));
        onMainSearch?.()
        cleanImmediateSearchResults();
    };
    useEffect(() => {
        setMainFilters(parser(guiFilters, mainFilters))
    }, [guiFilters])

    function selectFromDropdown(data: any, dataSourceName: string) {
        const makeUpSearchResult: OneSearch<any> = {
            ...mainResults,
            dataSourceToSearchResult: {
                [dataSourceName]: {
                    value: {
                        datasourceName: dataSourceName,
                        count: searchState.searches['main'].count,
                        data: [data],
                    }
                }
            }
        }
        setMainResults(makeUpSearchResult)
        cleanImmediateSearchResults();
        setSovereignPage('one')
    }

    return <>
        <h1>{translate(title)}</h1>
        <SearchBarAndImmediateSearchLayout>
            <SearchBar immediateSearch={immediateSearch} mainSearch={mainSearch} escapePressed={cleanImmediateSearchResults}/>
            <SearchDropDown st="immediate" onSelect={selectFromDropdown}/>
        </SearchBarAndImmediateSearchLayout>
        {children}
    </>
}


