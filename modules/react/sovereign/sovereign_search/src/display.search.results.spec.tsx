import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {DataPlugins, DataPlugin, DisplayDataProps, DisplayDataArrayProps, DataPluginProvider} from '@enterprise_search/react_data/src/react.data';
import {DataAndDataSource} from '@enterprise_search/search_state';
import {DefaultDisplaySearchResultDataType} from "./display.search.results";
import {DataViews} from "@enterprise_search/data_views";
import {GuiSelectedDataViewProvider} from "@enterprise_search/search_gui_state";

// Mock Components
const MockDisplayDataArray = jest.fn(({title}: DisplayDataArrayProps<any>) => (
    <span data-testid="data-array">{title} Array</span>
));

const MockDisplayDataWidget = jest.fn(({title}: { title: string }) => (
    <span data-testid="data-widget">{title} Widget</span>
));

// Mock Data Plugins
const mockPlugins: DataPlugins = {
    mockType: {
        plugin: 'data',
        type: 'mockType',
        DisplayData: MockDisplayDataArray,
        DisplayDataArray: MockDisplayDataArray,
        DisplayDataWidget: MockDisplayDataWidget,
        OneLineDisplayData: MockDisplayDataArray
    }
};

// Test Provider
const MockDataPluginProvider = ({children}: { children: React.ReactNode }) => {
    return <DataPluginProvider dataPlugins={mockPlugins}>{children}</DataPluginProvider>;
};

// Sample Data for Testing
const mockData: DataAndDataSource<any>[] = [
    {data: {name: 'Test Item 1'}, dataSourceName: 'source1'},
    {data: {name: 'Test Item 2'}, dataSourceName: 'source2'}
];

// Test Cases
describe('DisplaySearchResultDataType', () => {
    const renderComponent = (displayAsWidget: boolean) => {
        render(
            <MockDataPluginProvider>
                <DefaultDisplaySearchResultDataType
                    data={mockData}
                    displayAsWidget={displayAsWidget}
                    dataType="mockType"
                />
            </MockDataPluginProvider>
        );
    };

    it('renders DisplayDataArray when displayAsWidget is false', () => {
        renderComponent(false);
        expect(screen.getByTestId('data-array')).toHaveTextContent('mockType Array');
        expect(MockDisplayDataArray).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'mockType',
                data: mockData,
                id: 'data-mockType'
            }),
            {}
        );
    });

    it('renders DisplayDataWidget when displayAsWidget is true', () => {
        renderComponent(true);
        expect(screen.getByTestId('data-widget')).toHaveTextContent('mockType Widget');
        expect(MockDisplayDataWidget).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'mockType',
                data: mockData,
                id: 'data-mockType'
            }),
            {}
        );
    });

    it('throws an error when no plugin exists for the data type', () => {
        expect(() => {
            render(
                <MockDataPluginProvider>
                    <DefaultDisplaySearchResultDataType
                        data={mockData}
                        displayAsWidget={false}
                        dataType="unknownType"
                    />
                </MockDataPluginProvider>
            );
        }).toThrow('No plugin found for data type unknownType');
    });
});


describe("SearchResults", () => {
    const MockDisplayResultsLayout = ({ children }: { children: React.ReactNode }) => (
        <div data-testid="results-layout">{children}</div>
    );

    const MockDisplaySearchResultDataType = jest.fn(({ dataType }: { dataType: string }) => (
        <span data-testid={`result-${dataType}`}>{dataType}</span>
    ));

    const MockErrorInDataSource = jest.fn(({ dataSourceName }: { dataSourceName: string }) => (
        <span data-testid={`error-${dataSourceName}`}>{dataSourceName} Error</span>
    ));

// Mock Data Views
    const mockDataViews: DataViews<any> = {
        view1: {
            plugin: 'dataview',
            name: 'view1',
            displays: {} as any,
            datasources: [],
            displayAsWidget: false,
            expectedDataTypes: ['type1', 'type2']
        }}
    function MockSearchResultsProvider({children}: { children: React.ReactNode }) {
        return  <GuiSelectedDataViewProvider initialValue="view1">
            <SearchResultsLayoutProvider layout={MockDisplayResultsLayout}>
                <DataPluginProvider dataPlugins={mockPlugins}>
                    <SearchInfoProviderUsingUseState>
                        {children}
                    </SearchInfoProviderUsingUseState>
                </DataPluginProvider>
            </SearchResultsLayoutProvider>
        </GuiSelectedDataViewProvider>
    }

}   )