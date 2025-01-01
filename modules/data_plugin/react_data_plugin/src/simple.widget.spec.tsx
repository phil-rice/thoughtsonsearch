import React from "react";
import {render, screen} from "@testing-library/react";
import '@testing-library/jest-dom';
import {SimpleWidget} from "./simple.widget";
import {DataAndDataSource} from "@enterprise_search/search_state";
// Simple mock that just returns a span with a test ID
const simpleTableMock = jest.fn<any, any[]>(() => <span data-testid="simple-table">Simple table</span>);

jest.mock("@enterprise_search/react_utils/src/table", () => ({
    SimpleTable: (props: any) => simpleTableMock(props),
}));

// Mock for useRenderers hook
jest.mock("@enterprise_search/renderers", () => ({
    useRenderers: jest.fn(() => ({
        H2: ({id, value}: { id: string; value: string }) => (
            <h2 data-testid="widget-title" id={id}>
                {value}
            </h2>
        ),
    })),
}));

type MockData = {
    name: string;
    age: number;
    city: string;
};

const mockData: DataAndDataSource<any>[] = [
    {data: {name: "Alice", age: 30, city: "New York"}, dataSourceName: 'some source'},
    {data: {name: "Bob", age: 25, city: "San Francisco"}, dataSourceName: 'some source'},
];

// Helper function to render component
const renderWidget = (data = mockData, title = "User Data", id = "widget-1") => {
    const Widget = SimpleWidget<MockData>(["Name", "Age", "City"], ["name", "age", "city"], ["name"]);
    render(<Widget data={data} title={title} id={id}/>);
};

describe("SimpleWidget", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders title using H2 component", () => {
        renderWidget();

        const titleElement = screen.getByTestId("widget-title");
        expect(titleElement).toHaveTextContent("User Data");
        expect(titleElement).toHaveAttribute("id", "widget-1");
    });

    it("renders SimpleTable mock and checks its presence", () => {
        renderWidget();

        const tableElement = screen.getByTestId("simple-table");
        expect(tableElement).toBeInTheDocument();
        expect(tableElement).toHaveTextContent("Simple table");

        // Verify that the mock was called with correct props
        expect(simpleTableMock).toHaveBeenCalledWith({
            titles: ["Name", "Age", "City"],
            keys: ["name", "age", "city"],
            data: [
                {name: "Alice", age: 30, city: "New York"},
                {name: "Bob", age: 25, city: "San Francisco"},
            ],
            noWrap: ["name"],
        });
    });

    it("limits data to 10 entries when passed more", () => {
        const largeData = Array.from({length: 20}, (_, i) => ({
            data: {name: `User ${i}`, age: 20 + i, city: "City"},
            dataSourceName: 'some source'
        }));

        renderWidget(largeData);


        const calledWith = simpleTableMock.mock.calls[0][0] as {
            data: { name: string; age: number; city: string }[];
        };

        expect(calledWith.data).toHaveLength(10); // Assert that only 10 entries are passed
    });


    it("renders empty SimpleTable when no data is passed", () => {
        renderWidget([]);

        const tableElement = screen.getByTestId("simple-table");
        expect(tableElement).toBeInTheDocument();
        expect(simpleTableMock).toHaveBeenCalledWith({
            titles: ["Name", "Age", "City"],
            keys: ["name", "age", "city"],
            data: [],
            noWrap: ["name"],
        });
    });
});
