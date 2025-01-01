import '@testing-library/jest-dom';
import React from "react";
import {render, screen} from "@testing-library/react";

import {DisplayDataArrayProps} from "./react.data";
import {SimpleDisplayDataArray} from "./simple.display.data.array";
import {DataAndDataSource} from "@enterprise_search/search_state";

const MockDisplay = ({id, data}: { id: string; data: any }) => (
    <div data-testid={id}>{data.title}</div>
);

const mockData: DataAndDataSource<any>[] = [
    {data: {title: "Item 1", value: "Value 1"}, dataSourceName: 'someDs'},
    {data: {title: "Item 2", value: "Value 2"}, dataSourceName: 'someDs'},
];

const renderComponent = (props: Partial<DisplayDataArrayProps<any>> = {}) => {
    const defaultProps: DisplayDataArrayProps<any> = {
        id: "test-array",
        title: "Test Title",
        Display: MockDisplay,
        data: mockData,
        ...props,
    };

    render(<SimpleDisplayDataArray {...defaultProps} />);
};

describe("simpleDisplayDataArray", () => {
    it("renders title and all data items", () => {
        renderComponent();

        expect(screen.getByText("Test Title")).toBeInTheDocument();
        expect(screen.getByTestId("test-array-item-0")).toHaveTextContent("Item 1");
        expect(screen.getByTestId("test-array-item-1")).toHaveTextContent("Item 2");
    });

    it("renders the correct number of Display components", () => {
        renderComponent();
        const items = screen.getAllByTestId(/test-array-item-/);
        expect(items).toHaveLength(mockData.length);
    });

    it("passes correct props to each Display component", () => {
        renderComponent();

        const firstItem = screen.getByTestId("test-array-item-0");
        expect(firstItem).toHaveTextContent("Item 1");
    });

    it("handles an empty data array gracefully", () => {
        renderComponent({data: []});

        expect(screen.queryByTestId(/test-array-item-/)).not.toBeInTheDocument();
        expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("uses unique ids for each item", () => {
        renderComponent();
        expect(screen.getByTestId("test-array-item-0")).toBeInTheDocument();
        expect(screen.getByTestId("test-array-item-1")).toBeInTheDocument();
    });
});
