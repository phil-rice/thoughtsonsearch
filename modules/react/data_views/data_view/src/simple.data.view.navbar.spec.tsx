import React from 'react';
import '@testing-library/jest-dom';
import {act, fireEvent, render, screen} from '@testing-library/react';
import {DataViews, DataViewsProvider} from "./data.views";
import {DebugStateProvider} from "@enterprise_search/react_utils";
import {GuiSelectedDataViewProvider, SearchGuiStateProvider} from "@enterprise_search/search_gui_state";
import {SimpleDataViewNavItem} from "./simple.data.view.navbar";
import {StateInspector} from "./data.views.spec";
import {WindowUrlProviderForTests} from "@enterprise_search/routing";
import {SovereignStateProvider} from "@enterprise_search/sovereign";

// Mock DataViews
const mockDataViews: DataViews<any> = {
    dataView1: {
        plugin: 'dataview',
        name: 'Data View 1',
        displays: {} as any,
        datasources: [{type: 'db', names: ['db1', 'db2']}],
        displayAsWidget: true,
    },
    dataView2: {
        plugin: 'dataview',
        name: 'Data View 2',
        displays: {} as any,
        datasources: [{type: 'api', names: ['api1']}],
        displayAsWidget: false,
    },
};

// Test Providers Setup
const MockProviders = ({children}: { children: React.ReactNode }) => {
    const initialState = {
        searchQuery: '',
        filters: {dataviews: {selected: '', selectedNames: [], allowedNames: []}},
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

describe('SimpleDataViewNavItem', () => {
    it('renders with correct initial style', () => {
        render(
            <MockProviders>
                <SimpleDataViewNavItem name="dataView1"/>
            </MockProviders>
        );

        const button = screen.getByRole('button', {name: /dataView1/i});

        // Assert button styles when not selected
        expect(button).toHaveStyle({
            border: '1px solid #000',
            backgroundColor: '#fff',
            color: '#000',
        });
    });

    it('applies selected styles when selected', () => {
        render(
            <MockProviders>
                <SimpleDataViewNavItem name="dataView1"/>
                <StateInspector/>
            </MockProviders>
        );

        const button = screen.getByRole('button', {name: /dataView1/i});

        // Simulate selection by clicking
        act(() => {
            fireEvent.click(button);
        });

        // Assert updated styles after selection
        expect(button).toHaveStyle({
            border: '2px solid #007bff',
            backgroundColor: '#007bff',
            color: '#fff',
        });

        // Verify state update for selected data view
        expect(screen.getByTestId('state-inspector')).toHaveTextContent(
            '{ "searchQuery": "", "filters": { "dataviews": { "selectedNames": [], "allowedNames": [ "db1", "db2" ], "selected": "search" } } }'
        );
    });

    it('updates filter and selected state when clicked', () => {
        render(
            <MockProviders>
                <SimpleDataViewNavItem name="dataView2"/>
                <StateInspector/>
            </MockProviders>
        );

        const button = screen.getByRole('button', {name: /dataView2/i});

        act(() => {
            fireEvent.click(button);
        });

        const state = screen.getByTestId('state-inspector');

        // Assert state updates correctly
        expect(state).toHaveTextContent(
            '{ "searchQuery": "", "filters": { "dataviews": { "selectedNames": [], "allowedNames": [ "api1" ], "selected": "search" } } }'
        );
    });
});
