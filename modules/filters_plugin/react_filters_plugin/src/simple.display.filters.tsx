import {makeGetterSetter, useThrowError} from "@enterprise_search/react_utils";
import {useErrorBoundary} from "@enterprise_search/error_boundary";
import {lensBuilder} from "@enterprise_search/optics";
import React from "react";
import {DisplayFiltersProps, ReactFiltersPlugins, useReactFilters} from "./react.filters.plugin";
import {ThrowError} from "@enterprise_search/errors";

function findDisplayFilterFor<Filters, FilterName extends keyof Filters>(reportErrors: ThrowError, plugins: ReactFiltersPlugins<any>, filterName: FilterName, purpose: string) {
        const plugin = plugins[filterName]
        if (!plugin) reportErrors('s/w', `No plugin for '${filterName.toString()}'. Legal values are ${Object.keys(plugins).sort()}`);
        const DisplayFilter = purpose && purpose in plugin.PurposeToDisplay ? plugin.PurposeToDisplay[purpose] : plugin.DefaultDisplay
        return DisplayFilter;
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