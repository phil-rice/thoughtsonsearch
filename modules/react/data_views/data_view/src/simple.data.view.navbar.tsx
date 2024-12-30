import {DataViewNavBarLayout, NavBarItem, NavBarItemProps, useDataViews} from "./data.views";
import React from "react";
import {SearchGuiData, useGuiFilter, useGuiSelectedDataView, useSearchGuiState} from "@enterprise_search/search_gui_state";
import {DataViewFilterData, dataViewFilterName, DataViewFilters} from "@enterprise_search/react_data_views_filter_plugin";
import {lensBuilder} from "@enterprise_search/optics";


export const SimpleDataViewNavItem: NavBarItem = <Filters extends DataViewFilters>({name}:NavBarItemProps) => {
    const dataViews = useDataViews();  // Assuming this is where the available data views are fetched.
    const dataView = dataViews[name];
    const [filter, setFilter] = useGuiFilter<Filters, 'dataviews'>(dataViewFilterName)
    const [selectedDataView,setSelectedDataView] = useGuiSelectedDataView();
    const isSelected = selectedDataView === name;  // Check if the current item is selected

    return (
        <button
            style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                border: isSelected ? '2px solid #007bff' : '1px solid #000', // Highlight border if selected
                backgroundColor: isSelected ? '#007bff' : '#fff', // Blue background if selected
                color: isSelected ? '#fff' : '#000', // White text if selected
                cursor: 'pointer',
                transition: 'background-color 0.3s, border-color 0.3s', // Smooth transitions for hover and selection
            }}
            onClick={() => {
                const allowedNames = dataView.datasources.flatMap(ds => ds.names);  // Allow all data sources
                const filter: DataViewFilterData = {selectedNames: [], allowedNames, selected: selectedDataView};
                setFilter(filter);
                setSelectedDataView(name);
            }}
        >
            {name}
        </button>
    );
};


export const SimpleDataViewNavbarLayout: DataViewNavBarLayout = ({children}) => {
    return (
        <nav
            role="navigation"
            aria-label="Data view selection"
            className="data-view-navbar-layout"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1rem',
                gap: '1rem',
                flexWrap: 'wrap', // Allow items to wrap on smaller screens
            }}
        >{children}
        </nav>
    );
};

