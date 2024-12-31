import React from "react";
import { render, screen } from "@testing-library/react";
import { SimpleHtmlRenderer } from "./simple.html.renderer";
import '@testing-library/jest-dom';

describe("SimpleHtmlRenderer", () => {
    test("renders basic HTML safely", () => {
        render(<SimpleHtmlRenderer id="test" value="<b>Bold Text</b>" />);
        expect(screen.getByText("Bold Text")).toBeInTheDocument();
    });

    test("removes script tags", () => {
        const maliciousHtml = '<div>Hello</div><script>alert("XSS")</script>';
        render(<SimpleHtmlRenderer id="test" value={maliciousHtml} />);

        expect(screen.getByText("Hello")).toBeInTheDocument();
        expect(screen.queryByText("alert(\"XSS\")")).not.toBeInTheDocument();
        expect(document.getElementById("test-value")?.innerHTML).not.toContain("script");
    });

    test("removes inline event handlers", () => {
        const dangerousHtml = '<div onclick="alert(\'XSS\')">Click Me</div>';
        render(<SimpleHtmlRenderer id="test" value={dangerousHtml} />);

        const element = screen.getByText("Click Me");
        expect(element).toBeInTheDocument();
        expect(element.outerHTML).not.toContain("onclick");
    });

    test("strips javascript URLs", () => {
        const dangerousHtml = '<a href="javascript:alert(\'XSS\')">Click Link</a>';
        render(<SimpleHtmlRenderer id="test" value={dangerousHtml} />);

        const link = screen.getByText("Click Link");
        expect(link).toBeInTheDocument();
        expect(link.outerHTML).not.toContain("javascript:");
    });

    test("renders empty string gracefully", () => {
        render(<SimpleHtmlRenderer id="test" value="" />);
        expect(document.getElementById("test-value")?.innerHTML).toBe("");
    });

    test("allows safe HTML", () => {
        const safeHtml = '<p><strong>Safe Content</strong></p>';
        render(<SimpleHtmlRenderer id="test" value={safeHtml} />);

        expect(screen.getByText("Safe Content")).toBeInTheDocument();
        expect(document.getElementById("test-value")?.innerHTML).toContain("<strong>Safe Content</strong>");
    });
});
