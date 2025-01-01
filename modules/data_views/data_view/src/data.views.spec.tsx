import React, {} from 'react';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {dataSourceDetailsToDataView, DataViewNavBar, DataViews, DataViewsProvider, NavBarItem} from "./data.views";
import {CommonDataSourceDetails, DataSourceDetails} from "@enterprise_search/react_datasource_plugin";
import '@testing-library/jest-dom';
import {DebugStateProvider, useDebug} from "@enterprise_search/react_utils";
import {GuiSelectedDataViewProvider, SearchGuiStateProvider, useSearchGuiState} from "@enterprise_search/search_gui_state";
import {WindowUrlProviderForTests} from "@enterprise_search/routing";
import {SovereignStateProvider} from "@enterprise_search/sovereign";

// Mock NavBarItem component
const MockNavBarItem: NavBarItem = ({name}) => (
    <div data-testid={`navbar-item-${name}`}>Item: {name}</div>
);

describe('dataSourceDetailsToDataView', () => {
    const mockDataSources: DataSourceDetails<CommonDataSourceDetails> = {
        dataSource1: {
            details: [{type: 'db', names: ['db1', 'db2']}],
            displayAsWidget: true,
            expectedDataTypes: ['type1']
        },
        dataSource2: {
            details: [{type: 'api', names: ['api1']}],
        }
    };

    let result: DataViews<CommonDataSourceDetails>;

    beforeEach(() => {
        result = dataSourceDetailsToDataView(mockDataSources, MockNavBarItem);
    });

    it('creates data views for each data source', () => {
        expect(Object.keys(result)).toHaveLength(2);
        expect(result).toHaveProperty('dataSource1');
        expect(result).toHaveProperty('dataSource2');
    });

    it('sets the plugin to "dataview"', () => {
        expect(result.dataSource1.plugin).toBe('dataview');
        expect(result.dataSource2.plugin).toBe('dataview');
    });

    it('sets the correct name for each data view', () => {
        expect(result.dataSource1.name).toBe('dataSource1');
        expect(result.dataSource2.name).toBe('dataSource2');
    });

    it('passes the correct datasources', () => {
        expect(result.dataSource1.datasources).toEqual(mockDataSources.dataSource1.details);
        expect(result.dataSource2.datasources).toEqual(mockDataSources.dataSource2.details);
    });

    it('sets displayAsWidget based on input', () => {
        expect(result.dataSource1.displayAsWidget).toBe(true);
        expect(result.dataSource2.displayAsWidget).toBe(false);  // defaults to false if not explicitly set
    });

    it('passes expectedDataTypes if provided', () => {
        expect(result.dataSource1.expectedDataTypes).toEqual(['type1']);
        expect(result.dataSource2.expectedDataTypes).toBeUndefined();
    });

    it('renders the NavBarItem component for navbar display', () => {
        const NavBar = result.dataSource1.displays.navbar;
        render(<NavBar itemName="TestItem"/>);
        expect(screen.getByTestId('navbar-item-TestItem')).toBeInTheDocument();
        expect(screen.getByText('Item: TestItem')).toBeInTheDocument();
    });
});


// Mock DataViews
const mockDataViews: DataViews<any> = {
    dataView1: {
        plugin: 'dataview',
        name: 'dataView1',
        displays: {} as any,
        datasources: [{type: 'db', names: ['db1', 'db2']}],
        displayAsWidget: true,
    },
    dataView2: {
        plugin: 'dataview',
        name: 'dataView2',
        displays: {} as any,
        datasources: [{type: 'api', names: ['api1']}],
        displayAsWidget: false,
    },
};

// Mock Provider Setup
const MockDataViewProviders = ({children}: { children: React.ReactNode }) => {
    const initialState = {
        searchQuery: '',
        filters: {},
    };

    return (
        <DebugStateProvider debugState={{}}>
            <WindowUrlProviderForTests initialUrl={'http://localhost:3002/app/search'}>
                <SovereignStateProvider updateWindowsState={false}>
                    <GuiSelectedDataViewProvider updateWindowsState={false}>
                        <DataViewsProvider dataViews={mockDataViews}>
                            <SearchGuiStateProvider searchGuiState={initialState}>
                                {children}
                            </SearchGuiStateProvider>
                        </DataViewsProvider>
                    </GuiSelectedDataViewProvider>
                </SovereignStateProvider>

            </WindowUrlProviderForTests>
        </DebugStateProvider>
    );
};

export const StateInspector = () => {
    const [state] = useSearchGuiState();
    return <pre data-testid="state-inspector">{JSON.stringify(state, null, 2)}</pre>;
};
describe('DataViewNavBar', () => {
    let debugMock: jest.Mock;


    it('renders the nav bar with the correct data view options', () => {
        render(
            <MockDataViewProviders>
                <DataViewNavBar/>
            </MockDataViewProviders>
        );

        // Assert that data views from mock are present in the DOM
        expect(screen.getByText('Data Views.data View 1')).toBeInTheDocument();
        expect(screen.getByText('Data Views.data View 2')).toBeInTheDocument();
    });

    it('updates selected data view and state when a new option is clicked', () => {
        render(
            <MockDataViewProviders>
                <DataViewNavBar />
                <StateInspector /> {/* Renders state for assertion */}
            </MockDataViewProviders>
        );

        // Verify initial state
        expect(screen.getByTestId('state-inspector')).toHaveTextContent(
           '{ "searchQuery": "", "filters": {} }'
        );

        // Simulate selecting 'Data View 2'
        const dataView2Element = screen.getByText('Data Views.data View 2');
        act(() => {
            fireEvent.click(dataView2Element);
        });

        // Assert state update after selection
        expect(screen.getByTestId('state-inspector')).toHaveTextContent(
           '{ "searchQuery": "", "filters": { "dataviews": { "selected": "dataView2", "selectedNames": [], "allowedNames": [ "api1" ] } } }'
        );
    });

    it('sets default selected data view if none is initially selected', () => {
        render(
            <MockDataViewProviders>
                <DataViewNavBar/>
            </MockDataViewProviders>
        );

        // Assert that default (first) data view is selected
        expect(screen.getByText('Data Views.data View 1')).toBeInTheDocument();
    });
});
