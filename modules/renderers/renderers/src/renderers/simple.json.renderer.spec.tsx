import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { SimpleJsonRenderer } from "./simple.json.renderer";

// Simulate idFrom logic used in the component
const idFrom = (rootId: string, attribute: string) => `${rootId}-${attribute}`;

describe("SimpleJsonRenderer", () => {
    const rootId = "root";
    const attribute = "test";

    test("renders valid JSON string", () => {
        const json = JSON.stringify({ name: "Alice", age: 30 });
        const expectedId = idFrom(rootId, attribute);

        render(<SimpleJsonRenderer rootId={rootId} attribute={attribute} value={json} />);

        const element = screen.getByTestId(expectedId);
        expect(element).toBeInTheDocument();
        expect(element.textContent).toBe(JSON.stringify(JSON.parse(json), null, 2));
        expect(element).toHaveAttribute("aria-label", "Formatted JSON");
        expect(element).toHaveStyle("background-color: #f5f5f5");
    });

    test("renders invalid JSON with fallback message", () => {
        const invalidJson = "{ name: 'Bob' }";
        const expectedId = idFrom(rootId, attribute);

        render(<SimpleJsonRenderer rootId={rootId} attribute={attribute} value={invalidJson} />);

        const element = screen.getByTestId(expectedId);
        expect(element).toBeInTheDocument();
        expect(element.textContent).toBe(`invalid json: ${invalidJson}`);
        expect(element).toHaveAttribute("aria-label", "Invalid JSON data");
        expect(element).toHaveStyle("background-color: #ffe6e6");
    });

    test("renders empty JSON object", () => {
        const emptyObject = "{}";
        const expectedId = idFrom(rootId, attribute);

        render(<SimpleJsonRenderer rootId={rootId} attribute={attribute} value={emptyObject} />);

        const element = screen.getByTestId(expectedId);
        expect(element.textContent).toBe(JSON.stringify(JSON.parse(emptyObject), null, 2));
        expect(element).toHaveStyle("background-color: #f5f5f5");
    });

    test("renders null value", () => {
        const jsonNull = "null";
        const expectedId = idFrom(rootId, attribute);

        render(<SimpleJsonRenderer rootId={rootId} attribute={attribute} value={jsonNull} />);

        const element = screen.getByTestId(expectedId);
        expect(element.textContent).toBe("null");
        expect(element).toHaveStyle("background-color: #f5f5f5");
    });

    test("renders array as JSON", () => {
        const jsonArray = JSON.stringify([1, 2, 3]);
        const expectedId = idFrom(rootId, attribute);

        render(<SimpleJsonRenderer rootId={rootId} attribute={attribute} value={jsonArray} />);

        const element = screen.getByTestId(expectedId);
        expect(element.textContent).toBe(JSON.stringify(JSON.parse(jsonArray), null, 2));
        expect(element).toHaveStyle("background-color: #f5f5f5");
    });

    test("renders non-JSON string as invalid json", () => {
        const notJson = "Hello, World!";
        const expectedId = idFrom(rootId, attribute);

        render(<SimpleJsonRenderer rootId={rootId} attribute={attribute} value={notJson} />);

        const element = screen.getByTestId(expectedId);
        expect(element.textContent).toBe(`invalid json: ${notJson}`);
        expect(element).toHaveStyle("background-color: #ffe6e6");
    });
});
