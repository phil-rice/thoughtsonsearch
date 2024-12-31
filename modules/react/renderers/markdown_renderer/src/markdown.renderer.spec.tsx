import React from "react";
import { render, screen } from "@testing-library/react";

import '@testing-library/jest-dom';
import {MarkdownRenderer} from "./markdown.renderer";

describe("MarkdownRenderer", () => {
    test("renders basic markdown as HTML", () => {
        render(<MarkdownRenderer id="test" value="**Bold Text**" />);
        expect(screen.getByText("Bold Text").tagName).toBe("STRONG");
    });

    test("renders headings correctly", () => {
        render(<MarkdownRenderer id="test" value="# Heading 1" />);
        expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    test("renders list items properly", () => {
        render(<MarkdownRenderer id="test" value={`- Item 1\n- Item 2`} />);

        const listItems = screen.getAllByRole("listitem");

        expect(listItems).toHaveLength(2);
        expect(listItems[0]).toHaveTextContent("Item 1");
        expect(listItems[1]).toHaveTextContent("Item 2");
    });

    test("renders empty string gracefully", () => {
        render(<MarkdownRenderer id="test" value={""} />);
        const element = document.getElementById("test-value");
        expect(element).toBeInTheDocument();
        expect(element?.innerHTML).toBe("");
    });

    test("renders placeholder for null value", () => {
        render(<MarkdownRenderer id="test" value={null as any} />);
        const element = document.getElementById("test-value");
        expect(element).toBeInTheDocument();
        expect(element?.innerHTML).toBe("");
    });

    test("escapes raw HTML by default (XSS prevention)", () => {
        const maliciousHtml = "<script>alert('XSS')</script>";
        render(<MarkdownRenderer id="test" value={maliciousHtml} />);
        const element = document.getElementById("test-value");
        expect(element).toBeInTheDocument();
        expect(element?.innerHTML).toContain("&lt;script&gt;alert('XSS')&lt;/script&gt;");
    });

    test("renders mixed markdown and text", () => {
        render(<MarkdownRenderer id="test" value="Hello **World**!" />);

        const paragraph = screen.getByRole('paragraph') || document.querySelector('#test-value p');

        expect(paragraph).toHaveTextContent("Hello World!");
        expect(screen.getByText("World").tagName).toBe("STRONG");
    });



    test("handles multiple paragraphs", () => {
        render(<MarkdownRenderer id="test" value={"First paragraph.\n\nSecond paragraph."} />);
        const paragraphs = screen.getAllByText(/paragraph/);
        expect(paragraphs).toHaveLength(2);
        expect(paragraphs[0].tagName).toBe("P");
        expect(paragraphs[1].tagName).toBe("P");
    });
});
