import React from "react";
import {makeContextFor} from "@enterprise_search/react_utils";

export type SearchBarProps = { immediateSearch?: (query: string) => void, mainSearch?: () => void }
export type SearchBar = (props: SearchBarProps) => React.ReactElement

export const {Provider: SearchBarProvider, use: useSearchBar} = makeContextFor<SearchBar, 'searchBar'>('searchBar')
