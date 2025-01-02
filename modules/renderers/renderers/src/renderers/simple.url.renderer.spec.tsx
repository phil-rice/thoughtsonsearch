import { render, screen } from "@testing-library/react";
import React from "react";
import { SimpleUrlRenderer } from "./simple.url.renderer";
import { ellipsesInMiddle } from "@enterprise_search/recoil_utils";
import '@testing-library/jest-dom';

describe("SimpleUrlRenderer", () => {
    const rootId = "root";
    const attribute = "test";

    it("renders a valid URL as a link", () => {
        render(<SimpleUrlRenderer rootId={rootId} attribute={attribute} value="https://example.com" />);
        const link = screen.getByRole("link");

        expect(link).toHaveAttribute("href", "https://example.com");
        expect(link).toHaveTextContent("https://example.com");
        expect(link).toHaveAttribute("target", "_blank");
    });

    it("truncates long URLs with ellipses in the middle", () => {
        const longUrl = "https://averylongexample.com/some/deep/path/resource/file.html";
        const expectedText = ellipsesInMiddle(longUrl, 70);

        render(<SimpleUrlRenderer rootId={rootId} attribute="long-url" value={longUrl} />);
        const link = screen.getByRole("link");

        expect(link).toHaveTextContent(expectedText);
    });

    it("falls back to # for invalid URLs", () => {
        render(<SimpleUrlRenderer rootId={rootId} attribute="invalid-url" value="invalid-url" />);
        const link = screen.getByRole("link");

        expect(link).toHaveAttribute("href", "#");
        expect(link).toHaveTextContent("invalid-url");
    });

    it("renders empty string as invalid URL", () => {
        render(<SimpleUrlRenderer rootId={rootId} attribute="empty-url" value="" />);
        const link = screen.getByRole("link");

        expect(link).toHaveAttribute("href", "#");
        expect(link).toBeEmptyDOMElement();
    });

    it("provides full URL in aria-label and title", () => {
        const testUrl = "https://example.com/path";
        render(<SimpleUrlRenderer rootId={rootId} attribute="aria-label" value={testUrl} />);
        const link = screen.getByRole("link");

        expect(link).toHaveAttribute("aria-label", testUrl);
        expect(link).toHaveAttribute("title", testUrl);
    });
});
