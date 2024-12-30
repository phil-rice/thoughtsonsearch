import {DebugLog, NameAnd} from "@enterprise_search/recoil_utils";
import React from "react";
import {GetterSetter, makeContextFor, makeGetterSetter, useThrowError} from "@enterprise_search/react_utils";
import {lensBuilder} from "@enterprise_search/optics";
import {ThrowError} from "@enterprise_search/errors";
import {useErrorBoundary} from "@enterprise_search/error_boundary";
import {WindowUrlData} from "@enterprise_search/routing";

// Filters are intrinsically bound to many places, and therefore if we aren't very
// careful with our design they will become complex
// We have 'special filters' such as searchbar, and 'data sources' which are already in the search info
// We have 'simple filters' such as 'time' or 'location' which are just a blob in the search info,
// We display the filters differently for different purposes, so we provide an overrider


//This shows most of the filters, but not the searchbar.
export const filtersDisplayPurpose = 'filters.display.purpose'


//Filters must be a Record-like structure for this to work
//We enforce that the keys in filters are the keys in the ReactFiltersPlugins
export type ReactFiltersPlugins<Filters> = {
    [Key in keyof Filters]: ReactFiltersPlugin<Pick<Filters, Key>, Key>;
};

export type ReactFiltersPlugin<Filters, FilterName extends keyof Filters> = {
    plugin: 'filter'
    type: FilterName
    DefaultDisplay: DisplayFilter<Filters[FilterName]>
    //return null if you don't want to display in that purpose
    PurposeToDisplay: NameAnd<DisplayFilter<Filters[FilterName]> | null>
    /* When we have a soveriegn page that uses the filters, it uses these methods to interact with the url */
    fromUrl?: (debug: DebugLog, s: WindowUrlData, def: Filters[FilterName]) => Filters[FilterName]
    addToUrl?: (debug: DebugLog, u: URLSearchParams, f: Filters[FilterName],) => void
}


/** Filters may be viewing data pretty much anywhere in the state. So we pass in a getter/setter */
export type DisplayFilterProps<Filter> = { id?: string, filterOps: GetterSetter<Filter> }
export type DisplayFilter<Filter> = (props: DisplayFilterProps<Filter>) => React.ReactElement


export type FilterLayoutProps = {
    id: string
    children: React.ReactNode
}
export type FilterLayout = (props: FilterLayoutProps) => React.ReactElement

export type ReactFiltersContextData<Filters> = {
    plugins: ReactFiltersPlugins<Filters>
    PurposeToFilterLayout: NameAnd<FilterLayout>
}

export const {Provider: ReactFiltersProvider, use: useReactFilters} = makeContextFor<ReactFiltersContextData<any>, 'reactFilters'>('reactFilters')

function findDisplayFilterFor<Filters, FilterName extends keyof Filters>(reportErrors: ThrowError, plugins: ReactFiltersPlugins<any>, filterName: FilterName, purpose: string) {
    const plugin = plugins[filterName]
    if (!plugin) reportErrors('s/w', `No plugin for '${filterName.toString()}'. Legal values are ${Object.keys(plugins).sort()}`);
    const DisplayFilter = purpose && purpose in plugin.PurposeToDisplay ? plugin.PurposeToDisplay[purpose] : plugin.DefaultDisplay
    return DisplayFilter;
}

//returns a list of all the DisplayFilters for the given purpose. A classical example (the default)is for the 'main filter display' that has everything except the searchbar
export type DisplayFiltersProps<Filters> = { id: string, filtersOps: GetterSetter<Filters> }
export type DisplayFilters<Filters> = (props: DisplayFiltersProps<Filters>) => React.ReactElement
export type DisplayAllFiltersOps<Filters> = {
    DisplayAllFilters: DisplayFilters<Filters>
}

export const SimpleDisplayFilters = (filterPurpose: string) =>
    <Filters extends any>({filtersOps, id}: DisplayFiltersProps<Filters>) => {
        const reportErrors = useThrowError();
        const ErrorBoundary = useErrorBoundary()
        const [filters, setFilters] = filtersOps;
        const {plugins, PurposeToFilterLayout} = useReactFilters()
        const FilterLayout = PurposeToFilterLayout[filterPurpose];
        if (!FilterLayout) reportErrors('s/w', `No FilterLayout for purpose '${filterPurpose}'. Legal values are: ${Object.keys(PurposeToFilterLayout).sort().join(', ')}`);
        return <FilterLayout id={id}>
            {Object.keys(plugins).map((filterName) => {
                const DisplayFilter = findDisplayFilterFor<Filters, any>(reportErrors, plugins, filterName, filterPurpose);
                if (!DisplayFilter) return null;
                const filterOps = makeGetterSetter(filters, setFilters, lensBuilder<Filters>().focusOn(filterName as any));
                return <ErrorBoundary key={filterName} message={`error.filter.${filterName}`}><DisplayFilter id={`${id}.${filterName}`} filterOps={filterOps}/></ErrorBoundary>
            })}
        </FilterLayout>
    };

export function useDisplayAllFilters<Filters>(filterPurpose: string = filtersDisplayPurpose): DisplayAllFiltersOps<Filters> {
    return {DisplayAllFilters: SimpleDisplayFilters(filterPurpose)}
}
