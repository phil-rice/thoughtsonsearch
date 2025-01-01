import React, {ReactNode} from "react";
import {makeContextFor} from "@enterprise_search/react_utils";
import {DataAndDataSource, SearchType} from "@enterprise_search/search_state";
import {SimpleSearchBarAndImmediateSearchLayout} from "./simple.searchbar.and.immediate.search.layout";
import {SimpleSearchDropdown} from "./simple.search.dropdown";
import {NameAnd} from "@enterprise_search/recoil_utils";
import {Errors} from "@enterprise_search/errors";
import {SearchDropdownStyles} from "./search.drop.down.styles";

export type SearchBarAndImmediateSearchLayoutProps = { children: [ReactNode, ReactNode] }
export type SearchBarAndImmediateSearchLayout = (props: SearchBarAndImmediateSearchLayoutProps) => React.ReactElement

export type SearchDropDownProps = {
    st: SearchType,
    onSelect: (data: any, dataSourceName: string) => void,
    DisplaySearchDropDownResults?: DisplaySearchDropDownResults,
    DisplaySearchDropDownErrors?: DisplaySearchDropDownErrors,
    styles?: Partial<SearchDropdownStyles>;
}
export type SearchDropDown = (props: SearchDropDownProps) => React.ReactElement

export type DisplaySearchDropDownResultsProps = {
    dataAndDs: DataAndDataSource<any>[]
    onSelect: (data: any, dataSourceName: string) => void
    st: SearchType;
    styles: Pick<SearchDropdownStyles, 'suggestion'>
}
export type DisplaySearchDropDownResults = React.FC<DisplaySearchDropDownResultsProps>

export type DisplaySearchDropDownErrorsProps = {
    srToError: NameAnd<Errors>;
    styles:  Pick<SearchDropdownStyles, 'error'|'errors'>
}
export type DisplaySearchDropDownErrors = React.FC<DisplaySearchDropDownErrorsProps>


export type SearchDropDownComponents = {
    SearchDropDown: SearchDropDown
    SearchBarAndImmediateSearchLayout: SearchBarAndImmediateSearchLayout
}
export const {Provider: SearchDropDownProvider, use: useSearchDropDownComponents} = makeContextFor<SearchDropDownComponents, 'searchDropDown'>('searchDropDown')

export const simpleSearchDropDownComponents: SearchDropDownComponents = {
    SearchDropDown: SimpleSearchDropdown,
    SearchBarAndImmediateSearchLayout: SimpleSearchBarAndImmediateSearchLayout
}