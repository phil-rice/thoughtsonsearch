import React from "react";
import {makeContextFor} from "@enterprise_search/react_utils";
import {SearchBarStyles} from "./search.bar.styles";

export type SearchBarProps = {
      mainSearch?: () => void
    escapePressed?: () => void
    styles?: Partial<SearchBarStyles>
}
export type SearchBar = (props: SearchBarProps) => React.ReactElement

export const {Provider: SearchBarProvider, use: useSearchBar} = makeContextFor<SearchBar, 'searchBar'>('searchBar')
