import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {DataAndDataSource} from '@enterprise_search/search_state';
import {DataPluginProvider, DataPlugins, DisplayData} from "@enterprise_search/react_data";
import {SimpleDisplaySearchDropDownResults} from "./simple.search.dropdown";

// Mock Styles
const mockStyles = {
    suggestion: {
        padding: '10px',
        cursor: 'pointer',
    },
};

// Mock Display Components
const OneLineDisplayDataForDocument = ({data, id}: { data: any; id: string }) => (
    <div data-testid={id}>{`Document: ${data.title}`}</div>
);
const OneLineDisplayDataForImage = ({data, id}: { data: any; id: string }) => (
    <div data-testid={id}>{`Image: ${data.title}`}</div>
);

// Mock Data
const mockDataAndDs: DataAndDataSource<any>[] = [
    {data: {type: 'document', title: 'Document 1'}, dataSourceName: 'source1'},
    {data: {type: 'image', title: 'Image 1'}, dataSourceName: 'source2'},
];

function OneLineDisplayDataProvider({children, OneLineDisplayDataForDocument, OneLineDisplayDataForImage}: {
    children: React.ReactNode,
    OneLineDisplayDataForDocument: DisplayData<any>,
    OneLineDisplayDataForImage: DisplayData<any>,
}) {
    const dataPlugins: DataPlugins = {
        'image': {
            plugin: 'data',
            type: 'test',
            OneLineDisplayData: OneLineDisplayDataForImage

        } as any,
        'document': {
            plugin: 'data',
            type: 'test',
            OneLineDisplayData: OneLineDisplayDataForDocument
        } as any,

    }
    return <DataPluginProvider dataPlugins={dataPlugins}>
        {children}
    </DataPluginProvider>
}

describe('SimpleDisplaySearchDropDownResults with DataProvider', () => {
    const mockOnSelect = jest.fn();

    it('renders dropdown results correctly', () => {
        render(
            <OneLineDisplayDataProvider
                OneLineDisplayDataForDocument={OneLineDisplayDataForDocument}
                OneLineDisplayDataForImage={OneLineDisplayDataForImage}
            >
                <SimpleDisplaySearchDropDownResults
                    dataAndDs={mockDataAndDs}
                    onSelect={mockOnSelect}
                    st="main"
                    styles={mockStyles}
                />
            </OneLineDisplayDataProvider>
        );

        // Check if both results are rendered
        expect(screen.getByText('Document: Document 1')).toBeInTheDocument();
        expect(screen.getByText('Image: Image 1')).toBeInTheDocument();
    });

    it('calls onSelect with correct data when clicked', () => {
        render(
            <OneLineDisplayDataProvider
                OneLineDisplayDataForDocument={OneLineDisplayDataForDocument}
                OneLineDisplayDataForImage={OneLineDisplayDataForImage}
            >
                <SimpleDisplaySearchDropDownResults
                    dataAndDs={mockDataAndDs}
                    onSelect={mockOnSelect}
                    st="main"
                    styles={mockStyles}
                />
            </OneLineDisplayDataProvider>
        );

        const firstItem = screen.getByText('Document: Document 1');
        fireEvent.click(firstItem);

        // Ensure onSelect is called with correct data and source
        expect(mockOnSelect).toHaveBeenCalledWith(
            {type: 'document', title: 'Document 1'},
            'source1'
        );
    });


    it('renders empty without crashing when no data is passed', () => {
        render(
            <OneLineDisplayDataProvider
                OneLineDisplayDataForDocument={OneLineDisplayDataForDocument}
                OneLineDisplayDataForImage={OneLineDisplayDataForImage}
            >
                <SimpleDisplaySearchDropDownResults
                    dataAndDs={[]}
                    onSelect={mockOnSelect}
                    st="main"
                    styles={mockStyles}
                />
            </OneLineDisplayDataProvider>
        );

        expect(screen.queryByText('Document: Document 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Image: Image 1')).not.toBeInTheDocument();
    });
});
