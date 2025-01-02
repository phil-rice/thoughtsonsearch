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
import {useSelectedSovereign} from "@enterprise_search/sovereign";
import {useDebug} from "@enterprise_search/react_utils";
import {searchDebug} from "@enterprise_search/search";

export type CommonSearchSovereignPageProps = { title: string, onMainSearch?: () => void, children?: ReactNode }

//I have explored breaking this up for decoupling...
//But at the moment we can read very clearly what is happening, see all the stuff
//This is the one stop shopping for 'what happens when we search' and I have decided to leave it this big
export function CommonSearchSovereignPage<Filters extends DataViewFilters>({title, children, onMainSearch}: CommonSearchSovereignPageProps) {
    const translate = useTranslation()
    const debug = useDebug(searchDebug)
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

    function cleanImmediateSearchResults() {
        setImmediateResults(old => ({...old, dataSourceToSearchResult: {}}))
    }

    function mainSearch() {
        setGuiFilters(parser({...guiFilters, [keywordsFilterName]: searchQuery}, guiFilters));
        cleanImmediateSearchResults();
    }

    //Trigger main search when the gui filters change
    useEffect(() => {
        debug('guiFilters have changed so setting main filters')
        onMainSearch?.()
        setMainFilters(parser(guiFilters, mainFilters))
    }, [guiFilters])

    //In a separate use effect because we can only change one part of the state at once.
    //We could have changed both ... but the code is messy
    useEffect(() => {
        debug('guiFilters have changed so setting cleaning immediate search results')
        cleanImmediateSearchResults()
    }, [guiFilters]);

    // Trigger immediate search when the search query changes (Note... not when the gui filters change... when they change that will nuke the search results anyway)
    useEffect(() => {
        //needs bounce adding
        if (searchQuery?.trim()) {
            const newGuiFilters = {...guiFilters, [keywordsFilterName]: searchQuery}
            debug('search query has changed so will do immediate search for', searchQuery, newGuiFilters)
            setImmediateFilters(parser(newGuiFilters, immediateFilters))
        } else {
            debug('search query has been cleared so cleaning immediate search results')
            cleanImmediateSearchResults()
        }
    }, [searchQuery]);

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
            <SearchBar mainSearch={mainSearch} escapePressed={cleanImmediateSearchResults}/>
            <SearchDropDown st="immediate" onSelect={selectFromDropdown}/>
        </SearchBarAndImmediateSearchLayout>
        {children}
    </>
}


