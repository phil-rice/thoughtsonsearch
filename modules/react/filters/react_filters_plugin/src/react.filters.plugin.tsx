import {NameAnd} from "@enterprise_search/recoil_utils";
import React, {useMemo} from "react";
import {useSearchInfo} from "@enterprise_search/react_search_info/src/react.search.query";

export const searchbarFilter = 'searchbar'
export type ReactFiltersPlugins = NameAnd<ReactFiltersPlugin<any>>
export type ReactFiltersPlugin<Filter> = {
    plugin: 'filters'
    type: string
    Display: FilterPluginFn<Filter>
}

export type FilterPluginFn<Filter> = (onChange: (filter: Filter) => void) => DisplayFilter<Filter>
export type DisplayFilterProps<Filter> = {
    filter: Filter
}
export type DisplayFilter<Filter> = (props: DisplayFilterProps<Filter>) => React.ReactElement

export type FilterLayoutProps = {
    children: React.ReactNode
}
export type ReactFiltersContextData = {
    plugins: ReactFiltersPlugins
    FilterLayout: (props: FilterLayoutProps) => React.ReactElement
}
export const ReactFiltersContext = React.createContext<ReactFiltersContextData | undefined>(undefined)

export type ReactFiltersProviderProps = {
    value: ReactFiltersContextData
    children: React.ReactNode
}
export const ReactFiltersProvider = ({value, children}: ReactFiltersProviderProps) => {
    return <ReactFiltersContext.Provider value={value}>{children}</ReactFiltersContext.Provider>
}
export type ReactFiltersOps = {
    filterNames: string[]
    Filters: React.ReactElement
    SearchBar: (query: string) => React.ReactElement
}

export function useReactFilters(): ReactFiltersOps {
    const context = React.useContext(ReactFiltersContext)
    if (!context) throw new Error('useReactFilters must be used within a ReactFiltersProvider')
    const {plugins, FilterLayout} = context
    const {filters, searchFilter, setSearchFilter} = useSearchInfo()
    const filterNames = Object.keys(context.plugins)

    const FilterFor = (filterName: string) => {
        const plugin: ReactFiltersPlugin<any> = plugins[filterName]
        if (!plugin) throw new Error(`No plugin for ${filterName}. Plugins are ${filterNames}`)
        const Filter = plugin.Display(setSearchFilter)
        return <Filter key={filterName} filter={filters[filterName]}/>
    };

    const Filters = useMemo(() => <FilterLayout>
        {filterNames.filter(n => n != searchbarFilter).map(FilterFor)})
    </FilterLayout>, [context, searchFilter, setSearchFilter])

    const SearchBar = useMemo(() => () => FilterFor(searchbarFilter), [context, searchFilter, setSearchFilter])
    return {filterNames, Filters, SearchBar}
}