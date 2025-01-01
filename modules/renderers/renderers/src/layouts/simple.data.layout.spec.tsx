import { render, screen } from "@testing-library/react";
import React from "react";
import '@testing-library/jest-dom';
import {SimpleDataLayout} from "./simple.data.layout";

describe("SimpleDataLayout", () => {
    it("renders rows and cells with appropriate roles", () => {
        render(
            <SimpleDataLayout layout={[2, 1]}>
                <div>Item 1</div>
                <div>Item 2</div>
                <div>Item 3</div>
            </SimpleDataLayout>
        );

        const rows = screen.getAllByRole("row");
        expect(rows).toHaveLength(2);

        const cells = screen.getAllByRole("cell");
        expect(cells).toHaveLength(3);
    });

    it("handles layouts larger than the number of children", () => {
        render(
            <SimpleDataLayout layout={[3, 2]}>
                <div>Item 1</div>
            </SimpleDataLayout>
        );

        const rows = screen.getAllByRole("row");
        expect(rows).toHaveLength(1);

        const cells = screen.getAllByRole("cell");
        expect(cells).toHaveLength(1);
    });

    it("renders with custom class names", () => {
        render(
            <SimpleDataLayout layout={[1]} className="custom-class">
                <div>Child</div>
            </SimpleDataLayout>
        );

        const container = screen.getByRole("presentation");
        expect(container).toHaveClass("custom-class");
    });


});
