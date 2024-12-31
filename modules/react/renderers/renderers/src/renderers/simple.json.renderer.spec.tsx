import React from "react";
import {render} from "@testing-library/react";

import '@testing-library/jest-dom';
import {SimpleJsonRenderer} from "./simple.json.renderer";

describe("SimpleJsonRenderer", () => {
    test("renders valid JSON string", () => {
        const json = JSON.stringify({ name: "Alice", age: 30 });
        render(<SimpleJsonRenderer id="test" value={json} />);

        const element = document.getElementById("test-value");
        expect(element).toBeInTheDocument();
        expect(element?.textContent).toBe(JSON.stringify(JSON.parse(json), null, 2));
    });

    test("renders invalid JSON with fallback message", () => {
        const invalidJson = "{ name: 'Bob' }";
        render(<SimpleJsonRenderer id="test" value={invalidJson} />);

        const element = document.getElementById("test-value");
        expect(element).toBeInTheDocument();
        expect(element?.textContent).toBe(`invalid json: ${invalidJson}`);
    });

    test("renders empty JSON object", () => {
        const emptyObject = "{}";
        render(<SimpleJsonRenderer id="test" value={emptyObject} />);

        const element = document.getElementById("test-value");
        expect(element?.textContent).toBe(JSON.stringify(JSON.parse(emptyObject), null, 2));
    });

    test("renders null value", () => {
        const jsonNull = "null";
        render(<SimpleJsonRenderer id="test" value={jsonNull} />);

        const element = document.getElementById("test-value");
        expect(element?.textContent).toBe("null");
    });

    test("renders array as JSON", () => {
        const jsonArray = JSON.stringify([1, 2, 3]);
        render(<SimpleJsonRenderer id="test" value={jsonArray} />);

        const element = document.getElementById("test-value");
        expect(element?.textContent).toBe(JSON.stringify(JSON.parse(jsonArray), null, 2));
    });

    test("renders non-JSON string as invalid json", () => {
        const notJson = "Hello, World!";
        render(<SimpleJsonRenderer id="test" value={notJson} />);

        const element = document.getElementById("test-value");
        expect(element?.textContent).toBe(`invalid json: ${notJson}`);
    });
});
