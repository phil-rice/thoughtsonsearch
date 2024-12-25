import {DataViewNavBarLayout, NavBarItem, useDataViews} from "./data.views";
import React from "react";
import {SearchGuiData, useGuiSelectedDataView, useSearchGuiState} from "@enterprise_search/search_gui_state";
import {dataViewFilterName} from "@enterprise_search/react_data_views_filter_plugin";
import {lensBuilder} from "@enterprise_search/optics";


const selectedViewAndDataViewL = lensBuilder<SearchGuiData<any>>().focusCompose({
    selectedDataView: lensBuilder<SearchGuiData<any>>().focusOn('selectedDataView'),
    dataView: lensBuilder<SearchGuiData<any>>().focusOn('filters').focusOn(dataViewFilterName)
})

export const SimpleDataViewNavItem: NavBarItem = ({name}) => {
    const dataViews = useDataViews();  // Assuming this is where the available data views are fetched.
    const dataView = dataViews[name];
    const [searchGuiState, setSearchGuiState] = useSearchGuiState()
    const [selectedDataView] = useGuiSelectedDataView();
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
                const newState = selectedViewAndDataViewL.set(searchGuiState, {selectedDataView: name, dataView: {selectedNames: [], allowedNames}});
                setSearchGuiState(newState);
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

