import { render, screen } from "@testing-library/react";
import React from "react";
import { SimpleTextRenderer } from "./simple.text.renderer";
import '@testing-library/jest-dom';

describe("SimpleTextRenderer", () => {
    it("renders the value when provided", () => {
        render(<SimpleTextRenderer id="name" value="John Doe" />);
        const span = screen.getByText("John Doe");

        expect(span).toBeInTheDocument();
        expect(span).toHaveAttribute("id", "name-value");
        expect(span).not.toHaveAttribute("aria-label");
    });

    it("renders an empty span with an aria-label when value is missing", () => {
        render(<SimpleTextRenderer id="empty" value="" />);
        const span = screen.getByLabelText("Not available");

        expect(span).toBeInTheDocument();
        expect(span).toBeEmptyDOMElement();  // Empty visually
    });

    it("handles null gracefully with polite aria live", () => {
        render(<SimpleTextRenderer id="null" value={null as any} />);
        const span = screen.getByLabelText("Not available");

        expect(span).toBeInTheDocument();
        expect(span).toBeEmptyDOMElement();
        expect(span).toHaveAttribute("aria-live", "polite");
    });
});
