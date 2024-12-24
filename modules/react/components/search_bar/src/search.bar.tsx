import React from "react";
import {makeContextFor} from "@enterprise_search/react_utils";

export type SearchBarProps = { onSearch?: () => void }
export type SearchBar = (props: SearchBarProps) => React.ReactElement

export const {Provider: SearchBarProvider, use: useSearchBar} = makeContextFor<SearchBar,'searchBar'>('searchBar')
