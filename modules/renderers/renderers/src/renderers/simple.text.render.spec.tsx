import { render, screen } from "@testing-library/react";
import React from "react";
import { SimpleTextRenderer } from "./simple.text.renderer";
import '@testing-library/jest-dom';

describe("SimpleTextRenderer", () => {
    const rootId = "root";
    const attribute = "name";

    it("renders the value when provided", () => {
        render(<SimpleTextRenderer rootId={rootId} attribute={attribute} value="John Doe" />);
        const span = screen.getByText("John Doe");

        expect(span).toBeInTheDocument();
        expect(span).toHaveAttribute("id", `${rootId}-${attribute}`);
        expect(span).not.toHaveAttribute("aria-label");
    });

    it("renders an empty span with an aria-label when value is missing", () => {
        render(<SimpleTextRenderer rootId={rootId} attribute="empty" value="" />);
        const span = screen.getByLabelText("Not available");

        expect(span).toBeInTheDocument();
        expect(span).toBeEmptyDOMElement();  // Empty visually
    });

    it("handles null gracefully with polite aria live", () => {
        render(<SimpleTextRenderer rootId={rootId} attribute="null" value={null as any} />);
        const span = screen.getByLabelText("Not available");

        expect(span).toBeInTheDocument();
        expect(span).toBeEmptyDOMElement();
        expect(span).toHaveAttribute("aria-live", "polite");
    });
});
