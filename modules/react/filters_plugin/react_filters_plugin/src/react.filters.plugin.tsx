import {NameAnd} from "@enterprise_search/recoil_utils";
import React from "react";

// Filters are intrinsically bound to many places, and therefore if we aren't very
// careful with our design they will become complex
// We have 'special filters' such as searchbar, and 'data sources' which are already in the search info
// We have 'simple filters' such as 'time' or 'location' which are just a blob in the search info,
// We display the filters differently for different purposes, so we provide an overrider

// An example purpose is the '


export const dataSourcesFilterName = 'dataSources'

//This shows most of the filters, but not the searchbar.
export const filtersDisplayPurpose = 'filters.display.purpose'


//Filters must be a Record-like structure for this to work
//We enforce that the keys in filters are the keys in the ReactFiltersPlugins
export type ReactFiltersPlugins<Context, Filters extends Record<string, any>> = {
    [Key in keyof Filters]: ReactFiltersPlugin<Context, Filters, Key>;
};

export type ReactFiltersPlugin<Context, Filters, FilterName extends keyof Filters> = {
    plugin: 'filter'
    type: FilterName
    DefaultDisplay: DisplayFilter<Filters[FilterName]>
    //return null if you don't want to display in that purpose
    PurposeToDisplay: NameAnd<DisplayFilter<Filters[FilterName]> | null>
}

export type DisplayFilterProps<Filter> = {id?:string}
export type DisplayFilter<Filter> = (props: DisplayFilterProps<Filter>) => React.ReactElement


export type FilterLayoutProps = {
    children: React.ReactNode
}
export type FilterLayout = (props: FilterLayoutProps) => React.ReactElement
export type ReactFiltersContextData<Context, Filters> = {
    plugins: ReactFiltersPlugins<Context, Filters>
    PurposeToFilterLayout: NameAnd<FilterLayout>
}
export const ReactFiltersContext = React.createContext<ReactFiltersContextData<any, any> | undefined>(undefined)

export type ReactFiltersProviderProps<Context, Filters> = {
    value: ReactFiltersContextData<Context, Filters>
    children: React.ReactNode
}
export const ReactFiltersProvider = <Context, Filters>({value, children}: ReactFiltersProviderProps<Context, Filters>) => {
    return <ReactFiltersContext.Provider value={value}>{children}</ReactFiltersContext.Provider>
}
export type ReactFilterOps<Filter> = {
    DisplayFilter: DisplayFilter<Filter>
}

function findDisplayFilterFor<Context, Filters, FilterName extends keyof Filters>(plugins: ReactFiltersPlugins<Context, any>, filterName: FilterName, purpose: string) {
    const plugin = plugins[filterName]
    if (!plugin) throw new Error(`No plugin for '${filterName.toString()}'. Legal values are ${Object.keys(plugins).sort()}`);
    const DisplayFilter = purpose && purpose in plugin.PurposeToDisplay ? plugin.PurposeToDisplay[purpose] : plugin.DefaultDisplay
    return DisplayFilter;
}

export function useFilterDisplay<Context, Filters, FilterName extends keyof Filters>(filterName: FilterName, purpose?: string): ReactFilterOps<Filters[FilterName]> {
    const context = React.useContext(ReactFiltersContext)
    if (!context) throw new Error('useReactFilters must be used within a ReactFiltersProvider')
    const {plugins} = context
    const DisplayFilter = findDisplayFilterFor<Context, Filters, FilterName>(plugins, filterName, purpose);
    return {DisplayFilter}
}

type SearchBarOps = {
    SearchBar: () => React.ReactElement
}


//returns a list of all the DisplayFilters for the given purpose. A classical example (the default)is for the 'main filter display' that has everything except the searchbar

export type UseAllFiltersOps = {
    DisplayFilters: () => React.ReactElement
}

export function useAllFilters<Context, Filters>(filterPurpose: string = filtersDisplayPurpose): UseAllFiltersOps {
    const context = React.useContext(ReactFiltersContext);
    if (!context) throw new Error('useAllFiltersFor must be used within a ReactFiltersProvider.');

    const {plugins, PurposeToFilterLayout} = context;
    const FilterLayout = PurposeToFilterLayout[filterPurpose];
    if (!FilterLayout) throw new Error(`No FilterLayout for purpose '${filterPurpose}'. Legal values are: ${Object.keys(PurposeToFilterLayout).sort().join(', ')}`);


    // Return a React component
    const DisplayFilters = () => (
        <FilterLayout>
            {Object.keys(plugins).map((filterName) => {
                const DisplayFilter: DisplayFilter<any> = findDisplayFilterFor<Context, Filters, any>(plugins, filterName, filterPurpose);
                if (!DisplayFilter) return null;
                return <DisplayFilter key={filterName}/>;
            })}
        </FilterLayout>
    );

    return {DisplayFilters};
}