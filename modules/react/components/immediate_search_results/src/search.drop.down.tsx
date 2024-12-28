import React, {ReactNode} from "react";
import {makeContextFor} from "@enterprise_search/react_utils";
import {SearchType} from "@enterprise_search/search_state";
import {SimpleSearchBarAndImmediateSearchLayout} from "./simple.searchbar.and.immediate.search.layout";
import {SimpleSearchDropdown} from "./simple.search.dropdown";

export type SearchBarAndImmediateSearchLayoutProps = { children: [ReactNode, ReactNode] }
export type SearchBarAndImmediateSearchLayout = (props: SearchBarAndImmediateSearchLayoutProps) => React.ReactElement

export type SearchDropDownProps = { st: SearchType }
export type SearchDropDown = (props: SearchDropDownProps) => React.ReactElement

export type SearchDropDownComponents = {
    SearchDropDown: SearchDropDown
    SimpleSearchBarAndImmediateSearchLayout: SearchBarAndImmediateSearchLayout
}
export const {Provider: SearchDropDownProvider, use: useSearchDropDownComponents} = makeContextFor<SearchDropDownComponents, 'searchDropDown'>('searchDropDown')

export const simpleSearchDropDownComponents: SearchDropDownComponents = {
    SearchDropDown: SimpleSearchDropdown,
    SimpleSearchBarAndImmediateSearchLayout: SimpleSearchBarAndImmediateSearchLayout
}