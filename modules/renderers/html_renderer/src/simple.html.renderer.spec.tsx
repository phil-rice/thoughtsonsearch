import React from "react";
import { render, screen } from "@testing-library/react";
import { SimpleHtmlRenderer } from "./simple.html.renderer";
import '@testing-library/jest-dom';

describe("SimpleHtmlRenderer", () => {
    const rootId = "root";
    const attribute = "test";

    test("renders basic HTML safely", () => {
        render(<SimpleHtmlRenderer rootId={rootId} attribute={attribute} value="<b>Bold Text</b>" />);
        expect(screen.getByText("Bold Text")).toBeInTheDocument();
    });

    test("removes script tags", () => {
        const maliciousHtml = '<div>Hello</div><script>alert("XSS")</script>';
        render(<SimpleHtmlRenderer rootId={rootId} attribute={attribute} value={maliciousHtml} />);

        expect(screen.getByText("Hello")).toBeInTheDocument();
        expect(screen.queryByText('alert("XSS")')).not.toBeInTheDocument();
        expect(document.getElementById(`${rootId}-${attribute}`)?.innerHTML).not.toContain("script");
    });

    test("removes inline event handlers", () => {
        const dangerousHtml = '<div onclick="alert(\'XSS\')">Click Me</div>';
        render(<SimpleHtmlRenderer rootId={rootId} attribute={attribute} value={dangerousHtml} />);

        const element = screen.getByText("Click Me");
        expect(element).toBeInTheDocument();
        expect(element.outerHTML).not.toContain("onclick");
    });

    test("strips javascript URLs", () => {
        const dangerousHtml = '<a href="javascript:alert(\'XSS\')">Click Link</a>';
        render(<SimpleHtmlRenderer rootId={rootId} attribute={attribute} value={dangerousHtml} />);

        const link = screen.getByText("Click Link");
        expect(link).toBeInTheDocument();
        expect(link.outerHTML).not.toContain("javascript:");
    });

    test("renders empty string gracefully", () => {
        render(<SimpleHtmlRenderer rootId={rootId} attribute={attribute} value="" />);
        expect(document.getElementById(`${rootId}-${attribute}`)?.innerHTML).toBe("");
    });

    test("allows safe HTML", () => {
        const safeHtml = '<p><strong>Safe Content</strong></p>';
        render(<SimpleHtmlRenderer rootId={rootId} attribute={attribute} value={safeHtml} />);

        expect(screen.getByText("Safe Content")).toBeInTheDocument();
        expect(document.getElementById(`${rootId}-${attribute}`)?.innerHTML).toContain("<strong>Safe Content</strong>");
    });
});
