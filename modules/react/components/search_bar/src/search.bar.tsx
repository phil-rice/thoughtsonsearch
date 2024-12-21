import React, {createContext} from "react";

export type SearchBarProps = {}
export type SearchBar = (props: SearchBarProps) => React.ReactElement

export const SearchContext = createContext<SearchBar | undefined>(undefined)

export type SearchBarProviderProps = {
    SearchBar: SearchBar
    children: React.ReactNode
}

export const SearchBarProvider = ({SearchBar, children}: SearchBarProviderProps) => {
    return <SearchContext.Provider value={SearchBar}>{children}</SearchContext.Provider>
}

export const useSearchBar = () => {
    const SearchBar = React.useContext(SearchContext)
    if (!SearchBar) throw new Error("useSearchBar must be used within a SearchContextProvider")
    return {SearchBar}
}