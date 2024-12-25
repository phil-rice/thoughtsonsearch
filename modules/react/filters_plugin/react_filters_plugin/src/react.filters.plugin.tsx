import {NameAnd} from "@enterprise_search/recoil_utils";
import React from "react";
import {GetterSetter, makeContextFor, makeGetterSetter} from "@enterprise_search/react_utils";
import {lensBuilder} from "@enterprise_search/optics";
import {ReportError} from "@enterprise_search/errors";
import {useReportError} from "@enterprise_search/react_error";

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

export const {Provider: ReactFiltersProvider, use: useReactFilters} = makeContextFor('reactFilters', undefined as ReactFiltersContextData<any>)

function findDisplayFilterFor<Filters, FilterName extends keyof Filters>(reportErrors: ReportError, plugins: ReactFiltersPlugins<any>, filterName: FilterName, purpose: string) {
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
        const reportErrors = useReportError();
        const [filters, setFilters] = filtersOps;
        const {plugins, PurposeToFilterLayout} = useReactFilters()
        const FilterLayout = PurposeToFilterLayout[filterPurpose];
        if (!FilterLayout) reportErrors('s/w', `No FilterLayout for purpose '${filterPurpose}'. Legal values are: ${Object.keys(PurposeToFilterLayout).sort().join(', ')}`);
        return <FilterLayout id={id}>
            {Object.keys(plugins).map((filterName) => {
                const DisplayFilter: DisplayFilter<any> = findDisplayFilterFor<Filters, any>(reportErrors, plugins, filterName, filterPurpose);
                if (!DisplayFilter) return null;
                const filterOps = makeGetterSetter(filters, setFilters, lensBuilder<Filters>().focusOn(filterName as any));
                return <DisplayFilter key={filterName} id={`${id}.${filterName}`} filterOps={filterOps}/>;
            })}
        </FilterLayout>
    };

export function useDisplayAllFilters<Filters>(filterPurpose: string = filtersDisplayPurpose): DisplayAllFiltersOps<Filters> {
    return {DisplayAllFilters: SimpleDisplayFilters(filterPurpose)}
}
